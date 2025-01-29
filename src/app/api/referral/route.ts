import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product, { IProduct } from "@/lib/product";

declare global {
  interface Date {
    getISOWeek(): number;
  }
}

// Your weekly click-through rate analytics logic here...


export async function GET() {
  await dbConnect();

  try {
    const currentDate = new Date();

    Date.prototype.getISOWeek = function () {
      const date = new Date(this.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      const week1 = new Date(date.getFullYear(), 0, 4);
      return (
        1 +
        Math.round(
          ((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
        )
      );
    };
    
    // Your weekly click-through rate analytics logic here...
    
    // Get start of the current week (Monday)
    const startOfCurrentWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    );

    // Get start of the previous week
    const startOfLastWeek = new Date(
      new Date(startOfCurrentWeek).setDate(startOfCurrentWeek.getDate() - 7)
    );

    // Aggregate weekly click data
    const weeklyClicks = await Product.aggregate([
      {
        $group: {
          _id: {
            week: { $isoWeek: "$updatedAt" }, // Group by ISO week
            year: { $isoWeekYear: "$updatedAt" }, // Include year for cross-year weeks
          },
          totalClicks: { $sum: "$clicks" }, // Sum all clicks in the week
        },
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } }, // Sort by most recent week
    ]);

    // Extract current and previous week data
    const currentWeekData = weeklyClicks.find(
      (week) =>
        week._id.week === startOfCurrentWeek.getISOWeek() &&
        week._id.year === startOfCurrentWeek.getFullYear()
    ) || { totalClicks: 0 };

    const lastWeekData = weeklyClicks.find(
      (week) =>
        week._id.week === startOfLastWeek.getISOWeek() &&
        week._id.year === startOfLastWeek.getFullYear()
    ) || { totalClicks: 0 };

    // Calculate CTR percentage change
    const currentWeekClicks = currentWeekData.totalClicks || 0;
    const lastWeekClicks = lastWeekData.totalClicks || 0;

    const percentageChange =
      lastWeekClicks === 0
        ? currentWeekClicks > 0
          ? 100
          : 0
        : ((currentWeekClicks - lastWeekClicks) / lastWeekClicks) * 100;

    return NextResponse.json(
      {
        currentWeekClicks,
        lastWeekClicks,
        percentageChange,
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
