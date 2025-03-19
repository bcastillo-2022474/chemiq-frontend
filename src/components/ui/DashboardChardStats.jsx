export function OverviewChart() {
  return (
    <div className="rounded-2xl bg-gray-50 p-5 shadow-lg">
      <h2 className="text-base font-semibold mb-4">Overview</h2>
      <div className="h-64 flex items-end gap-2">
        {/* Simulated chart bars */}
        {[
          4500,
          2000,
          3500,
          5000,
          1500,
          2500,
          5500,
          3500,
          1500,
          2500,
          2000,
          4000
        ].map((height, i) => (
          <div
            key={i}
            className="w-full bg-lime-400 rounded-t-md"
            style={{ height: `${(height / 6000) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>$1500</span>
          <span>$3000</span>
          <span>$4500</span>
          <span>$6000</span>
        </div>
      </div>
    </div>
  )
}
