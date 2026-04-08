import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), "stats.json");

interface StatsEntry {
  timestamp: string;
  profile: Record<string, string>; // role, ai_frequency, ai_style, ai_expectation
  mbtiAnswers: string[];
  mbtiScores: Record<string, number>;
  type: string;
}

async function readStats(): Promise<StatsEntry[]> {
  try {
    const data = await fs.readFile(STATS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeStats(stats: StatsEntry[]) {
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry: StatsEntry = {
      timestamp: new Date().toISOString(),
      profile: body.profile,
      mbtiAnswers: body.mbtiAnswers,
      mbtiScores: body.mbtiScores,
      type: body.type,
    };

    const stats = await readStats();
    stats.push(entry);
    await writeStats(stats);

    return NextResponse.json({ ok: true, total: stats.length });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

function countField(stats: StatsEntry[], field: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of stats) {
    const val = entry.profile?.[field];
    if (val) counts[val] = (counts[val] || 0) + 1;
  }
  return counts;
}

export async function GET() {
  try {
    const stats = await readStats();
    const totalResponses = stats.length;

    // MBTI type distribution
    const typeCounts: Record<string, number> = {};
    const axisCounts: Record<string, number> = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
    };

    for (const entry of stats) {
      typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1;
      if (entry.mbtiScores) {
        for (const [axis, count] of Object.entries(entry.mbtiScores)) {
          axisCounts[axis] = (axisCounts[axis] || 0) + (count as number);
        }
      }
    }

    const total = (a: number, b: number) => (a + b > 0 ? Math.round((a / (a + b)) * 100) : 50);

    return NextResponse.json({
      totalResponses,
      // Profile insights
      profileStats: {
        role: countField(stats, "role"),
        aiFrequency: countField(stats, "ai_frequency"),
        aiStyle: countField(stats, "ai_style"),
        aiExpectation: countField(stats, "ai_expectation"),
      },
      // MBTI distribution
      mbtiStats: {
        topTypes: Object.entries(typeCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5),
        axisPercentages: {
          E_vs_I: total(axisCounts.E, axisCounts.I),
          S_vs_N: total(axisCounts.S, axisCounts.N),
          T_vs_F: total(axisCounts.T, axisCounts.F),
          J_vs_P: total(axisCounts.J, axisCounts.P),
        },
      },
      raw: stats,
    });
  } catch {
    return NextResponse.json({ error: "Failed to read" }, { status: 500 });
  }
}
