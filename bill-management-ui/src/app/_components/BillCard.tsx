import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Bill } from "@/models/bill";
import {
  getOrdinalSuffix,
  MONTH_NAMES_ABBR,
  MONTH_NAMES_FULL,
} from "@/utils/calendarUtils";

// For BillDetailScreen - shows recurrence pattern
export function scheduleLabel(bill: Bill): string {
  if (bill.recurrence === "monthly" && bill.recurringDayOfMonth != null) {
    const day = bill.recurringDayOfMonth;
    return `${day}${getOrdinalSuffix(day)} of each month`;
  }
  if (
    bill.recurrence === "yearly" &&
    bill.yearlyDueMonth != null &&
    bill.yearlyDueDay != null
  ) {
    const day = bill.yearlyDueDay;
    return `${MONTH_NAMES_ABBR[bill.yearlyDueMonth - 1]} ${day}${getOrdinalSuffix(day)} each year`;
  }
  return "One-time bill";
}

// For BillCard - shows next due date
function getNextDueDate(bill: Bill, isPastDue: boolean = false): string {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  if (bill.recurrence === "monthly" && bill.recurringDayOfMonth != null) {
    const dueDay = bill.recurringDayOfMonth;
    let dueMonth = currentMonth;
    let dueYear = currentYear;

    // For past due bills, show the current month's date (the one that was missed)
    // For upcoming bills, if the day has passed this month, show next month
    if (!isPastDue && currentDay > dueDay) {
      dueMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      if (dueMonth === 1) dueYear++;
    }

    return `${MONTH_NAMES_FULL[dueMonth - 1]} ${dueDay}${getOrdinalSuffix(dueDay)}`;
  }

  if (
    bill.recurrence === "yearly" &&
    bill.yearlyDueMonth != null &&
    bill.yearlyDueDay != null
  ) {
    const dueMonth = bill.yearlyDueMonth;
    const dueDay = bill.yearlyDueDay;

    return `${MONTH_NAMES_FULL[dueMonth - 1]} ${dueDay}${getOrdinalSuffix(dueDay)}`;
  }

  return "One-time bill";
}

/**
 * Displays a single bill in the list on the Dashboard. Shows name, due date, amount, and paid/due status.
 * Tapping the card navigates to the BillDetailScreen for that bill.
 * @param bill - The bill data to display in the card
 * @param isPastDue - Whether this bill is past due (affects date display)
 * @returns A styled Pressable card component representing a bill
 */
export default function BillCard({
  bill,
  isPastDue = false,
}: {
  bill: Bill;
  isPastDue?: boolean;
}) {
  const router = useRouter();

  return (
    <>
      <Pressable
        key={bill._id}
        style={({ pressed }) => [styles.billCard, pressed && styles.pressed]}
        onPress={() => router.push(`/screens/BillDetailScreen?id=${bill._id}`)}
      >
        <View style={styles.billInfo}>
          <Text style={styles.billName}>{bill.name}</Text>
          <Text style={styles.billDue}>{getNextDueDate(bill, isPastDue)}</Text>
        </View>
        <View style={styles.billRight}>
          <Text style={styles.billAmount}>${bill.amount.toFixed(2)}</Text>
          <View
            style={[
              styles.badge,
              bill.isPaid ? styles.badgePaid : styles.badgeDue,
            ]}
          >
            <Text style={styles.badgeText}>{bill.isPaid ? "Paid" : "Due"}</Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  // Bill cards
  billCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  billInfo: {
    gap: 4,
  },
  billName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  billDue: {
    fontSize: 12,
    color: "#888",
  },
  billRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  billAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgePaid: {
    backgroundColor: "#e6f4ea",
  },
  badgeDue: {
    backgroundColor: "#fff0f0",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#444",
  },
  pressed: {
    opacity: 0.7,
  },
});
