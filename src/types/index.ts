import { ObjectId } from "mongodb";

export interface Transaction {
  _id?: ObjectId | string;
  amount: number;
  date: string;
  description: string;
  category?: string;
  type: "income" | "expense";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage?: number;
}

export interface Budget {
  _id?: ObjectId | string;
  category: string;
  amount: number;
  month: string;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardSummary {
  totalExpenses: number;
  totalIncome: number;
  categoryBreakdown: CategoryExpense[];
  recentTransactions: Transaction[];
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health & Fitness",
  "Travel",
  "Education",
  "Business",
  "Personal Care",
  "Gifts & Donations",
  "Investments",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
