export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v14M3 10h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              Medi<span className="text-brand-600">Cart</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              Your trusted online pharmacy for medicines and healthcare essentials.
            </p>
          </div>

          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-semibold text-slate-800">Shop</p>
              <ul className="mt-3 flex flex-col gap-2 text-slate-500">
                <li className="transition-colors hover:text-brand-700">Medicines</li>
                <li className="transition-colors hover:text-brand-700">Healthcare Devices</li>
                <li className="transition-colors hover:text-brand-700">Supplements</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Support</p>
              <ul className="mt-3 flex flex-col gap-2 text-slate-500">
                <li className="transition-colors hover:text-brand-700">Track Order</li>
                <li className="transition-colors hover:text-brand-700">Help Center</li>
                <li className="transition-colors hover:text-brand-700">Contact Us</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} MediCart. For demo purposes only — not a real pharmacy.</p>
          <p>Made with care for your health.</p>
        </div>
      </div>
    </footer>
  );
}
