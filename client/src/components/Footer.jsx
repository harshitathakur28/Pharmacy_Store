export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
        <p className="font-semibold text-slate-700">MediCart Pharmacy</p>
        <p className="mt-1">Your trusted online pharmacy for medicines and healthcare essentials.</p>
        <p className="mt-4 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} MediCart. For demo purposes only — not a real pharmacy.
        </p>
      </div>
    </footer>
  );
}
