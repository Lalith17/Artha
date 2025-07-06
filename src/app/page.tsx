import TransactionManager from "@/components/TransactionManager";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetManager from "@/components/BudgetManager";
import BudgetOverview from "@/components/BudgetOverview";
import ClientOnly from "@/components/ClientOnly";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Artha</h1>
          <p className="text-gray-600 mt-2">
            Track your income, expenses, and budgets with detailed analytics
          </p>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Dashboard Summary */}
            <ClientOnly
              fallback={
                <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
              }
            >
              <DashboardSummary />
            </ClientOnly>

            {/* Budget Overview */}
            <ClientOnly
              fallback={
                <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
              }
            >
              <BudgetOverview />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="transactions">
            <ClientOnly
              fallback={
                <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
              }
            >
              <TransactionManager />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="budgets">
            <ClientOnly
              fallback={
                <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
              }
            >
              <BudgetManager />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClientOnly
                fallback={
                  <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
                }
              >
                <MonthlyExpenseChart />
              </ClientOnly>
              <ClientOnly
                fallback={
                  <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
                }
              >
                <CategoryPieChart />
              </ClientOnly>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
