import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Transaction, MonthlyExpense, CategoryExpense } from "@/types";

export async function GET() {
  try {
    const db = await getDatabase();
    const transactions = await db
      .collection<Transaction>("transactions")
      .find({})
      .toArray();

    // Calculate monthly expenses for the last 6 months
    const monthlyExpenses: MonthlyExpense[] = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      // Use consistent date formatting to avoid hydration mismatch
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthName = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      const monthlyTotal = transactions
        .filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === date.getMonth() &&
            transactionDate.getFullYear() === date.getFullYear() &&
            t.type === "expense"
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyExpenses.push({
        month: monthName,
        amount: monthlyTotal,
      });
    }

    // Calculate category breakdown for expenses
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const categoryMap = new Map<string, number>();
    expenseTransactions.forEach((t) => {
      const category = t.category || "Other";
      categoryMap.set(category, (categoryMap.get(category) || 0) + t.amount);
    });

    const categoryBreakdown: CategoryExpense[] = Array.from(
      categoryMap.entries()
    )
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Get recent transactions (last 5)
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return NextResponse.json({
      monthlyExpenses,
      categoryBreakdown,
      recentTransactions,
      totalTransactions: transactions.length,
      totalExpenses,
      totalIncome: transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
