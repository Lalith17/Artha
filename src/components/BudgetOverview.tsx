"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget, Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils-finance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Target, AlertTriangle, CheckCircle } from "lucide-react";

interface BudgetOverviewData {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "success" | "warning" | "danger";
}

interface BudgetOverviewProps {
  className?: string;
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function BudgetOverview({ className }: BudgetOverviewProps) {
  const [budgetData, setBudgetData] = useState<BudgetOverviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchBudgetOverview();
  }, []);

  const fetchBudgetOverview = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch budgets for current month
      const budgetsResponse = await fetch(
        `/api/budgets?month=${currentMonth}&year=${currentYear}`
      );
      if (!budgetsResponse.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const budgets: Budget[] = await budgetsResponse.json();

      // Fetch transactions for current month
      const transactionsResponse = await fetch("/api/transactions");
      if (!transactionsResponse.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const transactions: Transaction[] = await transactionsResponse.json();

      // Calculate budget overview data
      const overviewData: BudgetOverviewData[] = budgets.map((budget) => {
        const categoryTransactions = transactions.filter(
          (t) =>
            t.category === budget.category &&
            t.type === "expense" &&
            new Date(t.date).getMonth() === currentDate.getMonth() &&
            new Date(t.date).getFullYear() === budget.year
        );

        const spent = categoryTransactions.reduce(
          (sum, t) => sum + t.amount,
          0
        );
        const remaining = Math.max(0, budget.amount - spent);
        const percentage =
          budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        let status: "success" | "warning" | "danger" = "success";
        if (percentage >= 100) status = "danger";
        else if (percentage >= 80) status = "warning";

        return {
          category: budget.category,
          budget: budget.amount,
          spent,
          remaining,
          percentage,
          status,
        };
      });

      setBudgetData(overviewData);
      setTotalBudget(budgets.reduce((sum, b) => sum + b.amount, 0));
      setTotalSpent(overviewData.reduce((sum, d) => sum + d.spent, 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, currentDate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "danger":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  const chartData = budgetData.map((item) => ({
    name:
      item.category.length > 10
        ? item.category.substring(0, 10) + "..."
        : item.category,
    budget: item.budget,
    spent: item.spent,
    remaining: item.remaining,
  }));

  const pieData = budgetData.map((item, index) => ({
    name: item.category,
    value: item.spent,
    color: COLORS[index % COLORS.length],
  }));

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-md p-3 ${className}`}
      >
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentMonth} {currentYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">
              {overallPercentage.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget - totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            {getStatusIcon(
              overallPercentage >= 100
                ? "danger"
                : overallPercentage >= 80
                ? "warning"
                : "success"
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getStatusColor(
                overallPercentage >= 100
                  ? "danger"
                  : overallPercentage >= 80
                  ? "warning"
                  : "success"
              )}`}
            >
              {overallPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {overallPercentage >= 100
                ? "Over budget"
                : overallPercentage >= 80
                ? "Near limit"
                : "On track"}
            </p>
          </CardContent>
        </Card>
      </div>

      {budgetData.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Target className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="font-semibold text-gray-900">No budgets found</h3>
              <p className="text-gray-500">
                Create budgets to see your spending overview.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget vs Spent Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                    <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Spending Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Details */}
      {budgetData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <h4 className="font-medium">{item.category}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.spent)} of{" "}
                        {formatCurrency(item.budget)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getStatusColor(item.status)}`}>
                      {item.percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.remaining)} remaining
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
