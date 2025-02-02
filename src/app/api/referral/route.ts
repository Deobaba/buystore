import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/lib/product";

// Function to get the ISO week number
function getISOWeek(date: Date): number {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

export async function GET() {
  await dbConnect();

  try {
    const currentDate = new Date();

    // Get start of current week (Monday)
    const startOfCurrentWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    );

    // Get start of last week
    const startOfLastWeek = new Date(
      new Date(startOfCurrentWeek).setDate(startOfCurrentWeek.getDate() - 7)
    );

    // Aggregate weekly click and share data
    const weeklyStats = await Product.aggregate([
      {
        $group: {
          _id: {
            week: { $isoWeek: "$updatedAt" }, // Group by ISO week
            year: { $isoWeekYear: "$updatedAt" }, // Include year for cross-year weeks
          },
          totalClicks: { $sum: "$clicks" }, // Sum all clicks in the week
          totalShares: { $sum: "$shares" }, // Sum all shares in the week
        },
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } }, // Sort by most recent week
    ]);

    // Extract current and last week data
    const currentWeekData = weeklyStats.find(
      (week) =>
        week._id.week === getISOWeek(startOfCurrentWeek) &&
        week._id.year === startOfCurrentWeek.getFullYear()
    ) || { totalClicks: 0, totalShares: 0 };

    const lastWeekData = weeklyStats.find(
      (week) =>
        week._id.week === getISOWeek(startOfLastWeek) &&
        week._id.year === startOfLastWeek.getFullYear()
    ) || { totalClicks: 0, totalShares: 0 };

    // Calculate CTR & STR percentage change
    const currentWeekClicks = currentWeekData.totalClicks || 0;
    const lastWeekClicks = lastWeekData.totalClicks || 0;

    const currentWeekShares = currentWeekData.totalShares || 0;
    const lastWeekShares = lastWeekData.totalShares || 0;

    const clickChange =
      lastWeekClicks === 0
        ? currentWeekClicks > 0
          ? 100
          : 0
        : ((currentWeekClicks - lastWeekClicks) / lastWeekClicks) * 100;

    const shareChange =
      lastWeekShares === 0
        ? currentWeekShares > 0
          ? 100
          : 0
        : ((currentWeekShares - lastWeekShares) / lastWeekShares) * 100;

    return NextResponse.json(
      {
        clicks: {
          currentWeek: currentWeekClicks,
          lastWeek: lastWeekClicks,
          percentageChange: clickChange,
        },
        shares: {
          currentWeek: currentWeekShares,
          lastWeek: lastWeekShares,
          percentageChange: shareChange,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
