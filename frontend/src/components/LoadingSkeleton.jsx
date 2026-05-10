const skeletonRows = Array.from({ length: 6 }, (_, index) => index);

export default function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="mt-4 h-7 w-28 animate-pulse rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
        {skeletonRows.map((row) => (
          <div
            key={row}
            className="grid grid-cols-6 gap-4 border-b border-white/10 p-4 last:border-b-0"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-4 animate-pulse rounded-full bg-white/10"
                style={{ width: `${58 + ((row + index) % 4) * 10}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
