import { BarChart3, TrendingUp, Users, CheckCircle2 } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Nov", value: 2 },
  { month: "Dec", value: 1 },
  { month: "Jan", value: 4 },
  { month: "Feb", value: 3 },
  { month: "Mar", value: 5 },
  { month: "Apr", value: 2 },
  { month: "May", value: 3 },
];

const MAX_VAL = Math.max(...MONTHLY_DATA.map((d) => d.value));

const COMPETENCY_DATA = [
  { name: "Leadership", pct: 85 },
  { name: "HR Strategy", pct: 92 },
  { name: "DEI Strategy", pct: 78 },
  { name: "Employee Relations", pct: 70 },
  { name: "Talent Acquisition", pct: 65 },
];

export function Analytics() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#253746]">Analytics</h1>
        <p className="text-gray-500 mt-1">A summary of your 360° feedback activity.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Requests Sent", value: "7", icon: BarChart3, color: "text-[#253746]", bg: "bg-[#f2f4f5]" },
          { label: "Response Rate", value: "74%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Unique Raters", value: "12", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Cycles Completed", value: "2", icon: CheckCircle2, color: "text-[#A4343A]", bg: "bg-red-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="ni-card flex items-center gap-4">
            <div className={`p-3 rounded-full ${bg} shrink-0`}>
              <Icon className={`size-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#253746]">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart — Requests per Month */}
        <div className="ni-card space-y-4">
          <h2 className="font-bold text-[#253746] flex items-center gap-2">
            <BarChart3 className="size-4 text-[#A4343A]" /> Feedback Requests by Month
          </h2>
          <div className="flex items-end gap-3 h-40 pt-4">
            {MONTHLY_DATA.map(({ month, value }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-[#253746]">{value}</span>
                <div
                  className="w-full rounded-t-md bg-[#A4343A] hover:bg-[#c84d54] transition-colors"
                  style={{ height: `${(value / MAX_VAL) * 100}%`, minHeight: "4px" }}
                  title={`${value} requests`}
                />
                <span className="text-[10px] text-gray-400">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competency coverage */}
        <div className="ni-card space-y-4">
          <h2 className="font-bold text-[#253746] flex items-center gap-2">
            <TrendingUp className="size-4 text-[#A4343A]" /> Feedback Coverage by Competency
          </h2>
          <div className="space-y-3">
            {COMPETENCY_DATA.map(({ name, pct }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{name}</span>
                  <span className="text-gray-500 font-bold">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A4343A] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <strong>Coming soon:</strong> Real-time competency ratings, trend analysis, and peer comparison benchmarks.
      </div>
    </div>
  );
}
