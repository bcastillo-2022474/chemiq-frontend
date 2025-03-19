export function MetricCard({ title, value, change, icon }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{title}</p>
        <div className="text-gray-600">{icon}</div>
      </div>
      <div className="mt-3">
        <h3 className="text-xl font-semibold">{value}</h3>
        <p className="text-xs text-gray-400">{change}</p>
      </div>
    </div>
  )
}
