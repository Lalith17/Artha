# Personal Finance Visualizer

A modern web application for tracking personal finances built with Next.js, React, TypeScript, shadcn/ui, Recharts, and MongoDB.

## Features

### Stage 1: Basic Transaction Tracking ✅

- ✅ Add, edit, and delete transactions (amount, date, description)
- ✅ Transaction list view with type indicators
- ✅ Monthly expenses bar chart
- ✅ Form validation and error handling
- ✅ Responsive design

### Stage 2: Categories ✅

- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart
- ✅ Dashboard with summary cards (total expenses, income, net balance)
- ✅ Category breakdown with percentages
- ✅ Recent transactions display
- ✅ Top spending categories

### Stage 3: Budgeting ✅

- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison with progress bars
- ✅ Budget status tracking (on track, warning, over budget)
- ✅ Budget overview dashboard with charts
- ✅ Total budget vs spent summary
- ✅ Monthly budget management
- ✅ Visual budget alerts and progress indicators

## User Interface

The application features a clean, modern interface with:

- **Tabbed Navigation**: Easy switching between Overview, Transactions, Budgets, and Analytics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Charts**: Real-time data visualization with Recharts
- **Modal Forms**: Intuitive forms for adding/editing transactions and budgets
- **Progress Indicators**: Visual feedback for budget usage and status

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Database**: MongoDB
- **Icons**: Lucide React
- **Validation**: Custom validation utilities

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd finance_manager
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=finance_manager
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Transactions

1. Click "Add Transaction" button
2. Fill in the transaction details:
   - Type: Income or Expense
   - Amount: Transaction amount
   - Date: Transaction date
   - Description: Brief description
   - Category: Select from predefined categories
3. Click "Add Transaction" to save

### Viewing Analytics

- Monthly expense trends are displayed in the bar chart
- Total expenses and income are calculated automatically
- Recent transactions are shown in the list view

### Managing Transactions

- Edit transactions by clicking the edit icon
- Delete transactions by clicking the trash icon
- All changes are saved to MongoDB

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transactions/
│   │   │   └── route.ts        # Transaction CRUD API
│   │   └── analytics/
│   │       └── route.ts        # Analytics API
│   ├── globals.css
│   └── page.tsx                # Main dashboard
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── TransactionManager.tsx  # Transaction CRUD interface
│   ├── MonthlyExpenseChart.tsx # Monthly expense visualization
│   ├── CategoryPieChart.tsx    # Category-wise pie chart
│   └── DashboardSummary.tsx    # Dashboard summary cards
├── lib/
│   ├── mongodb.ts              # Database connection
│   ├── utils.ts                # shadcn/ui utilities
│   └── utils-finance.ts        # Finance-specific utilities
└── types/
    └── index.ts                # TypeScript type definitions
```

## API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions` - Update transaction
- `DELETE /api/transactions?id=<id>` - Delete transaction

### Analytics

- `GET /api/analytics` - Get analytics data (monthly expenses, totals)

## Database Schema

### Transaction

```typescript
{
  _id: ObjectId,
  amount: number,
  date: string,
  description: string,
  category: string,
  type: 'income' | 'expense',
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS**
- **Digital Ocean**

Make sure to:

1. Set up your MongoDB database
2. Configure environment variables
3. Build and deploy the application

## Future Enhancements

- Category management
- Budget tracking
- Data export/import
- Multi-currency support
- Investment tracking
- Bill reminders
- Financial goals
- Advanced analytics and insights
