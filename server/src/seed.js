import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Medicine from './models/Medicine.js';
import mongoose from 'mongoose';

function placeholder(text, bg, fg) {
  return `https://placehold.co/400x400/${bg}/${fg}?text=${encodeURIComponent(text)}`;
}

const medicines = [
  { name: 'Paracetamol 500mg', description: 'Fast relief from fever and mild to moderate pain.', category: 'Tablets', price: 25, stock: 200, manufacturer: 'Cipla', requiresPrescription: false, imageUrl: placeholder('Paracetamol', 'e5f5ee', '047857') },
  { name: 'Ibuprofen 400mg', description: 'Anti-inflammatory tablet for pain and swelling relief.', category: 'Tablets', price: 40, stock: 150, manufacturer: 'Sun Pharma', requiresPrescription: false, imageUrl: placeholder('Ibuprofen', 'e5f5ee', '047857') },
  { name: 'Amoxicillin 250mg', description: 'Broad-spectrum antibiotic capsules for bacterial infections.', category: 'Tablets', price: 85, stock: 80, manufacturer: 'Alkem Labs', requiresPrescription: true, imageUrl: placeholder('Amoxicillin', 'e5f5ee', '047857') },
  { name: 'Cetirizine 10mg', description: 'Antihistamine for allergy, sneezing, and runny nose relief.', category: 'Tablets', price: 18, stock: 300, manufacturer: 'Dr. Reddy\'s', requiresPrescription: false, imageUrl: placeholder('Cetirizine', 'e5f5ee', '047857') },
  { name: 'Aspirin 75mg', description: 'Low-dose aspirin for cardiovascular protection.', category: 'Tablets', price: 22, stock: 180, manufacturer: 'Bayer', requiresPrescription: false, imageUrl: placeholder('Aspirin', 'e5f5ee', '047857') },
  { name: 'Metformin 500mg', description: 'Oral medication to control blood sugar in type 2 diabetes.', category: 'Tablets', price: 55, stock: 120, manufacturer: 'USV Pvt Ltd', requiresPrescription: true, imageUrl: placeholder('Metformin', 'e5f5ee', '047857') },

  { name: 'Cough Syrup - Honey Lemon', description: 'Soothing syrup for dry and wet cough relief.', category: 'Syrups', price: 95, stock: 90, manufacturer: 'Himalaya', requiresPrescription: false, imageUrl: placeholder('Cough+Syrup', 'fef3c7', 'b45309') },
  { name: 'Paracetamol Syrup (Kids)', description: 'Fever and pain relief syrup formulated for children.', category: 'Syrups', price: 60, stock: 100, manufacturer: 'Cipla', requiresPrescription: false, imageUrl: placeholder('Kids+Syrup', 'fef3c7', 'b45309') },
  { name: 'Digestive Antacid Syrup', description: 'Relieves acidity, gas, and indigestion.', category: 'Syrups', price: 78, stock: 110, manufacturer: 'Abbott', requiresPrescription: false, imageUrl: placeholder('Antacid', 'fef3c7', 'b45309') },
  { name: 'Multivitamin Syrup', description: 'Daily multivitamin syrup to boost immunity and energy.', category: 'Syrups', price: 130, stock: 70, manufacturer: 'Zydus', requiresPrescription: false, imageUrl: placeholder('Multivitamin', 'fef3c7', 'b45309') },

  { name: 'Digital Thermometer', description: 'Fast and accurate digital body temperature reader.', category: 'Devices', price: 220, stock: 60, manufacturer: 'Omron', requiresPrescription: false, imageUrl: placeholder('Thermometer', 'dbeafe', '1d4ed8') },
  { name: 'Blood Pressure Monitor', description: 'Automatic upper-arm BP monitor with digital display.', category: 'Devices', price: 1850, stock: 25, manufacturer: 'Omron', requiresPrescription: false, imageUrl: placeholder('BP+Monitor', 'dbeafe', '1d4ed8') },
  { name: 'Pulse Oximeter', description: 'Measures blood oxygen saturation (SpO2) and pulse rate.', category: 'Devices', price: 999, stock: 40, manufacturer: 'Dr. Trust', requiresPrescription: false, imageUrl: placeholder('Oximeter', 'dbeafe', '1d4ed8') },
  { name: 'Glucometer Kit', description: 'Blood glucose monitoring kit with 10 test strips.', category: 'Devices', price: 1250, stock: 30, manufacturer: 'Accu-Chek', requiresPrescription: false, imageUrl: placeholder('Glucometer', 'dbeafe', '1d4ed8') },

  { name: 'Hand Sanitizer 500ml', description: '70% alcohol-based sanitizer kills 99.9% germs.', category: 'Personal Care', price: 150, stock: 200, manufacturer: 'Dettol', requiresPrescription: false, imageUrl: placeholder('Sanitizer', 'fce7f3', 'be185d') },
  { name: 'Antiseptic Liquid 200ml', description: 'For cuts, wounds, and general disinfection.', category: 'Personal Care', price: 85, stock: 150, manufacturer: 'Savlon', requiresPrescription: false, imageUrl: placeholder('Antiseptic', 'fce7f3', 'be185d') },
  { name: 'Face Mask (Pack of 50)', description: '3-ply disposable surgical face masks.', category: 'Personal Care', price: 199, stock: 300, manufacturer: 'Venus', requiresPrescription: false, imageUrl: placeholder('Face+Mask', 'fce7f3', 'be185d') },

  { name: 'Vitamin C 1000mg', description: 'Immunity-boosting effervescent tablets, orange flavor.', category: 'Supplements', price: 320, stock: 90, manufacturer: 'HealthKart', requiresPrescription: false, imageUrl: placeholder('Vitamin+C', 'ede9fe', '6d28d9') },
  { name: 'Omega-3 Fish Oil', description: 'Supports heart and brain health, 60 softgels.', category: 'Supplements', price: 450, stock: 70, manufacturer: 'HealthVit', requiresPrescription: false, imageUrl: placeholder('Omega-3', 'ede9fe', '6d28d9') },
  { name: 'Calcium + Vitamin D3', description: 'Bone health supplement, 60 tablets.', category: 'Supplements', price: 210, stock: 100, manufacturer: 'Zydus', requiresPrescription: false, imageUrl: placeholder('Calcium+D3', 'ede9fe', '6d28d9') },

  { name: 'First Aid Kit (Compact)', description: 'Essential kit with bandages, antiseptic, and tools.', category: 'First Aid', price: 399, stock: 50, manufacturer: 'St. John', requiresPrescription: false, imageUrl: placeholder('First+Aid', 'fee2e2', 'b91c1c') },
  { name: 'Adhesive Bandages (Pack of 100)', description: 'Waterproof sterile bandages for minor cuts.', category: 'First Aid', price: 99, stock: 250, manufacturer: 'Johnson & Johnson', requiresPrescription: false, imageUrl: placeholder('Bandages', 'fee2e2', 'b91c1c') },

  { name: 'Baby Diapers (Size M, 40pcs)', description: 'Soft, absorbent diapers for overnight comfort.', category: 'Baby Care', price: 599, stock: 80, manufacturer: 'Pampers', requiresPrescription: false, imageUrl: placeholder('Diapers', 'ecfccb', '4d7c0f') },
  { name: 'Baby Lotion 200ml', description: 'Gentle moisturizing lotion for delicate baby skin.', category: 'Baby Care', price: 175, stock: 90, manufacturer: 'Johnson\'s Baby', requiresPrescription: false, imageUrl: placeholder('Baby+Lotion', 'ecfccb', '4d7c0f') },
];

async function seed() {
  await connectDB();

  await User.deleteMany({ email: 'admin@medicart.com' });
  await Medicine.deleteMany({});

  const admin = await User.create({
    name: 'Store Admin',
    email: 'admin@medicart.com',
    password: 'admin123',
    role: 'admin',
    phone: '9999999999',
  });

  const demoUserExisting = await User.findOne({ email: 'user@medicart.com' });
  if (!demoUserExisting) {
    await User.create({
      name: 'Demo User',
      email: 'user@medicart.com',
      password: 'user1234',
      role: 'user',
      phone: '8888888888',
    });
  }

  await Medicine.insertMany(medicines);

  console.log('Seed complete.');
  console.log(`Admin login -> email: ${admin.email}, password: admin123`);
  console.log('Demo user login -> email: user@medicart.com, password: user1234');
  console.log(`${medicines.length} medicines inserted.`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
