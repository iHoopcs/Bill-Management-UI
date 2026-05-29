import { Bill } from "@/models/bill";

// Utility file for month names and related constants
export const MONTH_NAMES_FULL = [
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

// Abbreviated month names for display in schedule labels
export const MONTH_NAMES_ABBR = [
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

// Number of days in each month (non-leap year)
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Utility to get the correct ordinal suffix for a given day number
export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Helper function to check if a bill is past due for a given viewed month/year
export const isPastDue = (
  bill: Bill,
  viewedMonthIndex: number,
  viewedYear: number,
): boolean => {
  if (bill.isPaid) return false;

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthIndex = today.getMonth(); // 0-indexed
  const currentYear = today.getFullYear();

  // Viewed month is in the future — never past due
  if (
    viewedYear > currentYear ||
    (viewedYear === currentYear && viewedMonthIndex > currentMonthIndex)
  ) {
    return false;
  }

  if (bill.recurrence === "monthly" && bill.recurringDayOfMonth != null) {
    // Viewed month is fully in the past — past due
    if (
      viewedYear < currentYear ||
      (viewedYear === currentYear && viewedMonthIndex < currentMonthIndex)
    ) {
      return true;
    }
    // Current month — past due only if the day has already passed
    return currentDay > bill.recurringDayOfMonth;
  }

  if (
    bill.recurrence === "yearly" &&
    bill.yearlyDueMonth != null &&
    bill.yearlyDueDay != null
  ) {
    if (viewedYear < currentYear) return true;
    // Same year — past due if the month/day has already passed
    const currentMonth = currentMonthIndex + 1; // 1-indexed to match yearlyDueMonth
    if (currentMonth > bill.yearlyDueMonth) return true;
    if (currentMonth === bill.yearlyDueMonth && currentDay > bill.yearlyDueDay)
      return true;
  }

  return false;
};

// Helper function to check if a bill was paid in the given viewed month
export const isPaidThisMonth = (
  bill: Bill,
  viewedMonthIndex: number,
  viewedYear: number,
): boolean => {
  if (!bill.isPaid || !bill.paidDate) return false;

  const paidDate = new Date(bill.paidDate);

  return (
    paidDate.getMonth() === viewedMonthIndex &&
    paidDate.getFullYear() === viewedYear
  );
};
// Default export for backward compatibility
export default MONTH_NAMES_FULL;
