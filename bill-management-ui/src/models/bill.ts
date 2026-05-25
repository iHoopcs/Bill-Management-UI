export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly";

export interface Bill {
  _id: string;
  user: string;
  name: string;
  amount: number;
  dueDate: string;
  isRecurring: boolean;
  recurrence?: RecurrenceType;
  isPaid: boolean;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillDto {
  name: string;
  amount: number;
  dueDate: string;
  isRecurring?: boolean;
  recurrence?: RecurrenceType;
  isPaid?: boolean;
  paidDate?: string;
}

export interface UpdateBillDto extends Partial<CreateBillDto> {}
