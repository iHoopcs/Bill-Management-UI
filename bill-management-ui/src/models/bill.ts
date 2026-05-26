export type RecurrenceType = "monthly" | "yearly";

export interface Bill {
  _id: string;
  user: string;
  name: string;
  amount: number;
  /** 'monthly' | 'yearly' | null (one-time bill) */
  recurrence: RecurrenceType | null;
  /** Day of the month (1–31) the bill is due — used for monthly recurrence */
  recurringDayOfMonth: number | null;
  /** Month (1–12) the bill is due — used for yearly recurrence */
  yearlyDueMonth: number | null;
  /** Day (1–31) the bill is due — used for yearly recurrence */
  yearlyDueDay: number | null;
  /** Optional end date for recurring bills (null = indefinite) */
  recurrenceEndDate: string | null;
  /** Days before the due date to send a reminder */
  reminderDays: number;
  isPaid: boolean;
  paidDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillDto {
  name: string;
  amount: number;
  recurrence?: RecurrenceType | null;
  recurringDayOfMonth?: number | null;
  yearlyDueMonth?: number | null;
  yearlyDueDay?: number | null;
  recurrenceEndDate?: string | null;
  reminderDays?: number;
  isPaid?: boolean;
  paidDate?: string | null;
  notes?: string | null;
}

export interface UpdateBillDto extends Partial<CreateBillDto> {}
