const bills = [
  { label: '$100', className: 'left-[6%] top-[10%] rotate-[-14deg] delay-0' },
  { label: '$50', className: 'right-[9%] top-[18%] rotate-[12deg] delay-300' },
  { label: '$20', className: 'left-[12%] top-[58%] rotate-[9deg] delay-700' },
  { label: '$10', className: 'right-[16%] top-[64%] rotate-[-10deg] delay-1000' },
  { label: '$', className: 'left-[45%] top-[34%] rotate-[4deg] delay-500' }
];

export default function MoneyBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.11),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.07),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.06),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div className="finance-orbit left-[18%] top-[20%]" />
      <div className="finance-orbit right-[12%] top-[46%] h-56 w-56 opacity-50" />

      {bills.map((bill) => (
        <div key={`${bill.label}-${bill.className}`} className={`money-bill absolute ${bill.className}`}>
          <span>{bill.label}</span>
          <div className="h-9 w-9 rounded-full border border-emerald-200/25" />
        </div>
      ))}
    </div>
  );
}
