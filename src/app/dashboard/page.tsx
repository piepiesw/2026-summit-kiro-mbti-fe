"use client";

import { sampleStats } from "@/data/sampleStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// ---- Small Components ----

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10">
      <p className="text-sm lg:text-base text-white/40">{label}</p>
      <p className="text-3xl lg:text-4xl font-bold mt-1 bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
        {value}
      </p>
      {sub && <p className="text-xs lg:text-sm text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

function AxisBar({
  left,
  right,
  leftPct,
}: {
  left: string;
  right: string;
  leftPct: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm lg:text-base">
        <span className="text-accent font-bold">
          {left} {leftPct}%
        </span>
        <span className="text-accent-secondary font-bold">
          {100 - leftPct}% {right}
        </span>
      </div>
      <div className="h-3 lg:h-4 rounded-full bg-white/10 overflow-hidden flex">
        <div
          className="h-full bg-accent rounded-l-full transition-all"
          style={{ width: `${leftPct}%` }}
        />
        <div
          className="h-full bg-accent-secondary rounded-r-full transition-all"
          style={{ width: `${100 - leftPct}%` }}
        />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg lg:text-xl font-bold text-white/80 mb-4 lg:mb-5 flex items-center gap-2">
      {children}
    </h2>
  );
}

// ---- Custom Tooltip ----
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm">
      <p className="text-white/60">{label}</p>
      <p className="text-accent font-bold">{payload[0].value}명</p>
    </div>
  );
}

// ---- Main Dashboard ----

export default function DashboardPage() {
  const s = sampleStats;

  const topType = s.typeDistribution[0];
  const topFeature = s.kiroFeatureHits[0];
  const peakHour = s.hourlyParticipation.reduce((a, b) =>
    a.count > b.count ? a : b
  );

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 md:px-6 lg:px-8 xl:px-12 max-w-6xl xl:max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Kiro MBTI Dashboard</h1>
          <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-mono">
            SAMPLE
          </span>
        </div>
        <p className="text-sm lg:text-base text-white/40">
          AWS Summit Seoul 2026 · Kiro Booth 실시간 통계
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-10">
        <StatCard label="총 참여자" value={s.totalResponses} sub="명" />
        <StatCard
          label="1위 유형"
          value={topType.type}
          sub={`${topType.count}명`}
        />
        <StatCard
          label="인기 Kiro 기능"
          value={topFeature.name}
          sub={`${topFeature.count}회 추천`}
        />
        <StatCard
          label="피크 시간"
          value={peakHour.hour}
          sub={`${peakHour.count}명 참여`}
        />
      </div>

      {/* Row 1: MBTI Distribution + Axis */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-10">
        {/* MBTI 유형 분포 */}
        <div className="md:col-span-2 p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10">
          <SectionTitle>MBTI 유형 분포</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={s.typeDistribution}>
              <XAxis
                dataKey="type"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {s.typeDistribution.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? "#00d4aa" : "rgba(255,255,255,0.15)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 축별 비율 */}
        <div className="p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10">
          <SectionTitle>축별 비율</SectionTitle>
          <div className="space-y-5">
            <AxisBar
              left="E 외향"
              right="I 내향"
              leftPct={s.axisPercentages.E}
            />
            <AxisBar
              left="S 감각"
              right="N 직관"
              leftPct={s.axisPercentages.S}
            />
            <AxisBar
              left="T 사고"
              right="F 감정"
              leftPct={s.axisPercentages.T}
            />
            <AxisBar
              left="J 판단"
              right="P 인식"
              leftPct={s.axisPercentages.J}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Profile Stats (4 pie charts) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-10">
        {[
          { title: "직업군", data: s.roleDistribution },
          { title: "AI 사용 빈도", data: s.aiFrequency },
          { title: "AI 사용 스타일", data: s.aiStyle },
          { title: "AI 기대 기능", data: s.aiExpectation },
        ].map((chart) => (
          <div
            key={chart.title}
            className="p-4 lg:p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-sm font-bold text-white/60 mb-2">
              {chart.title}
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chart.data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown, name: unknown) => [
                    `${value}명`,
                    String(name),
                  ]}
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {chart.data.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-2 text-xs text-white/50"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="truncate">{d.name}</span>
                  <span className="ml-auto text-white/30">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Kiro Features + Hourly */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-10">
        {/* Kiro 추천 기능 분포 */}
        <div className="p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10">
          <SectionTitle>Kiro 추천 기능 등장 빈도</SectionTitle>
          <div className="space-y-3">
            {s.kiroFeatureHits.map((f, i) => {
              const maxCount = s.kiroFeatureHits[0].count;
              const pct = (f.count / maxCount) * 100;
              return (
                <div key={f.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{f.emoji}</span>
                      <span
                        className={
                          i === 0 ? "text-accent font-bold" : "text-white/60"
                        }
                      >
                        {f.name}
                      </span>
                    </span>
                    <span className="text-white/40 font-mono text-xs">
                      {f.count}회
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background:
                          i === 0
                            ? "linear-gradient(90deg, #00d4aa, #7c5cfc)"
                            : "rgba(255,255,255,0.15)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 시간대별 참여 */}
        <div className="p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10">
          <SectionTitle>시간대별 참여 추이</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={s.hourlyParticipation}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#00d4aa"
                strokeWidth={2}
                fill="url(#grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-white/20 pt-4">
        Sample data · Powered by Kiro
      </div>
    </main>
  );
}
