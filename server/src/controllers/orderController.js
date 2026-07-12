import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';

const UPI_ID_REGEX = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;

export async function createOrder(req, res, next) {
  try {
    const { items, paymentMethod, upiId, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    if (!['COD', 'UPI'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }
    if (paymentMethod === 'UPI' && !UPI_ID_REGEX.test(upiId || '')) {
      return res.status(400).json({ message: 'Enter a valid UPI ID (e.g. name@bank)' });
    }
    const requiredAddressFields = ['line1', 'city', 'state', 'pincode', 'phone'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress?.[field]) {
        return res.status(400).json({ message: `Shipping address ${field} is required` });
      }
    }

    const medicineIds = items.map((i) => i.medicineId);
    const medicines = await Medicine.find({ _id: { $in: medicineIds } });
    const medicineMap = new Map(medicines.map((m) => [m._id.toString(), m]));

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const medicine = medicineMap.get(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found: ${item.medicineId}` });
      }
      const qty = Number(item.qty) || 0;
      if (qty < 1) {
        return res.status(400).json({ message: `Invalid quantity for ${medicine.name}` });
      }
      if (medicine.stock < qty) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
      }
      orderItems.push({
        medicine: medicine._id,
        name: medicine.name,
        price: medicine.price,
        qty,
      });
      totalAmount += medicine.price * qty;
    }

    const decremented = [];
    for (const item of orderItems) {
      const updated = await Medicine.findOneAndUpdate(
        { _id: item.medicine, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { new: true }
      );
      if (!updated) {
        for (const done of decremented) {
          await Medicine.findByIdAndUpdate(done.medicine, { $inc: { stock: done.qty } });
        }
        return res.status(409).json({ message: `Insufficient stock for ${item.name}` });
      }
      decremented.push(item);
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      upiId: paymentMethod === 'UPI' ? upiId : '',
      shippingAddress,
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
}
