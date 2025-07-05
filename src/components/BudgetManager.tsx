"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Budget, Transaction, CATEGORIES } from "@/types";
import { formatCurrency } from "@/lib/utils-finance";
import { Plus, Edit2, Trash2, Target, TrendingUp } from "lucide-react";

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (budget: Omit<Budget, "_id">) => void;
  onClose: () => void;
  isEdit?: boolean;
}

function BudgetForm({
  budget,
  onSubmit,
  onClose,
  isEdit = false,
}: BudgetFormProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState({
    category: budget?.category || "Food & Dining",
    amount: budget?.amount.toString() || "",
    month: budget?.month || currentMonth,
    year: budget?.year || currentYear,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        year: formData.year,
      };

      if (budgetData.amount <= 0) {
        setErrors(["Amount must be greater than 0"]);
        setLoading(false);
        return;
      }

      onSubmit(budgetData);
      onClose();
    } catch (err) {
      console.error("Error saving budget:", err);
      setErrors(["An error occurred while saving the budget"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            {errors.map((error, index) => (
              <p key={index} className="text-red-800 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Budget Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select
              value={formData.month}
              onValueChange={(value) =>
                setFormData({ ...formData, month: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select
              value={formData.year.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, year: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-2 pt-4 mt-4 border-t sticky bottom-0 bg-white">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : isEdit ? "Update Budget" : "Create Budget"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  budgetProgress: Record<string, { spent: number; percentage: number }>;
}

function BudgetList({
  budgets,
  onEdit,
  onDelete,
  budgetProgress,
}: BudgetListProps) {
  const getBudgetStatus = (budget: Budget) => {
    const progress = budgetProgress[budget._id?.toString() || ""];
    if (!progress) return { status: "success", percentage: 0 };

    const percentage = progress.percentage;
    if (percentage >= 100) return { status: "danger", percentage };
    if (percentage >= 80) return { status: "warning", percentage };
    return { status: "success", percentage };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "danger":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const { status, percentage } = getBudgetStatus(budget);
        const progress = budgetProgress[budget._id?.toString() || ""];

        return (
          <Card key={budget._id?.toString()} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">{budget.category}</h3>
                  <span className="text-sm text-gray-500">
                    {budget.month} {budget.year}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      {progress ? formatCurrency(progress.spent) : "$0.00"} of{" "}
                      {formatCurrency(budget.amount)}
                    </span>
                    <span className="text-sm font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(
                        status
                      )}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {percentage >= 100 && (
                    <p className="text-sm text-red-600 mt-1 font-medium">
                      Budget exceeded by{" "}
                      {formatCurrency(progress.spent - budget.amount)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(budget)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(budget._id?.toString() || "")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetProgress, setBudgetProgress] = useState<
    Record<string, { spent: number; percentage: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/budgets?month=${currentMonth}&year=${currentYear}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const data = await response.json();
      setBudgets(data);

      // Calculate budget progress
      await calculateBudgetProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  const calculateBudgetProgress = async (budgets: Budget[]) => {
    try {
      const progressData: Record<
        string,
        { spent: number; percentage: number }
      > = {};

      for (const budget of budgets) {
        // Fetch transactions for this category and month
        const transactionsResponse = await fetch("/api/transactions");
        if (transactionsResponse.ok) {
          const transactions = await transactionsResponse.json();

          // Filter transactions for this category and month
          const categoryTransactions = transactions.filter(
            (t: Transaction) =>
              t.category === budget.category &&
              t.type === "expense" &&
              new Date(t.date).getMonth() === new Date().getMonth() &&
              new Date(t.date).getFullYear() === budget.year
          );

          const spent = categoryTransactions.reduce(
            (sum: number, t: Transaction) => sum + t.amount,
            0
          );
          const percentage =
            budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

          progressData[budget._id?.toString() || ""] = { spent, percentage };
        }
      }

      setBudgetProgress(progressData);
    } catch (err) {
      console.error("Error calculating budget progress:", err);
    }
  };

  const handleSubmit = async (budgetData: Omit<Budget, "_id">) => {
    try {
      const url = "/api/budgets";
      const method = editingBudget ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingBudget ? { ...budgetData, _id: editingBudget._id } : budgetData
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save budget");
      }

      await fetchBudgets();
      setIsDialogOpen(false);
      setEditingBudget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      const response = await fetch(`/api/budgets?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      await fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleAddNew = () => {
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Budget Manager</h2>
          <p className="text-gray-600">
            {currentMonth} {currentYear} Budgets
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md w-[95vw] max-w-[425px] max-h-[90vh] my-4 flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {editingBudget ? "Edit Budget" : "Create New Budget"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto min-h-0">
              <BudgetForm
                budget={editingBudget || undefined}
                onSubmit={handleSubmit}
                onClose={() => setIsDialogOpen(false)}
                isEdit={!!editingBudget}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {budgets.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <TrendingUp className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="font-semibold text-gray-900">No budgets set</h3>
              <p className="text-gray-500">
                Create your first budget to start tracking your spending goals.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <BudgetList
          budgets={budgets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          budgetProgress={budgetProgress}
        />
      )}
    </div>
  );
}
