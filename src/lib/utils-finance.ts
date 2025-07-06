export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
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
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function getMonthName(date: Date): string {
  const monthNames = [
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
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function validateTransaction(transaction: {
  amount: number;
  date: string;
  description: string;
  type: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!transaction.amount || transaction.amount <= 0) {
    errors.push("Amount must be greater than 0");
  }

  if (!transaction.date) {
    errors.push("Date is required");
  } else {
    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      errors.push("Invalid date format");
    }
  }

  if (!transaction.description || transaction.description.trim().length === 0) {
    errors.push("Description is required");
  }

  if (!transaction.type || !["income", "expense"].includes(transaction.type)) {
    errors.push("Type must be either income or expense");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
