import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Bill } from "@/models/bill";
import { User } from "@/models/user";
import { billService } from "@/services/billService";
import { userService } from "@/services/userService";
import BottomNav from "@/app/_components/BottomNav";
import BillCard from "../_components/BillCard";
import { MONTH_NAMES_FULL } from "@/utils/calendarUtils";

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      // Fetch user and bills in parallel — faster than sequential awaits
      const [userData, billsData] = await Promise.all([
        userService.getUser(),
        billService.getBillsForUser(),
      ]);
      setUser(userData);
      setBills(billsData);
    } catch (err: any) {
      setError(err.message ?? "Failed to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Runs once when the screen mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Computed once on mount — no need to recalculate on every render
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "there";

  const currentMonthYear = useMemo(() => {
    const now = new Date();
    return `${MONTH_NAMES_FULL[now.getMonth()]} ${now.getFullYear()}`;
  }, []);

  // Helper function to check if a bill is past due
  const isPastDue = (bill: Bill): boolean => {
    if (bill.isPaid) return false;

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (bill.recurrence === "monthly" && bill.recurringDayOfMonth != null) {
      // Past due if the recurring day has already passed this month
      return currentDay > bill.recurringDayOfMonth;
    }

    if (
      bill.recurrence === "yearly" &&
      bill.yearlyDueMonth != null &&
      bill.yearlyDueDay != null
    ) {
      // Past due if the month/day has already passed this year
      if (currentMonth > bill.yearlyDueMonth) return true;
      if (
        currentMonth === bill.yearlyDueMonth &&
        currentDay > bill.yearlyDueDay
      )
        return true;
    }

    return false;
  };

  // Helper function to check if a bill is upcoming this month
  const isUpcomingThisMonth = (bill: Bill): boolean => {
    if (bill.isPaid) return false;

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;

    if (bill.recurrence === "monthly" && bill.recurringDayOfMonth != null) {
      // Upcoming if the recurring day hasn't passed yet this month
      return currentDay <= bill.recurringDayOfMonth;
    }

    if (
      bill.recurrence === "yearly" &&
      bill.yearlyDueMonth != null &&
      bill.yearlyDueDay != null
    ) {
      // Upcoming if it's due this month and day hasn't passed
      if (currentMonth === bill.yearlyDueMonth) {
        return currentDay <= bill.yearlyDueDay;
      }
      return false;
    }

    // One-time bills - show if not paid
    return true;
  };

  // Helper function to check if a bill was paid this month
  const isPaidThisMonth = (bill: Bill): boolean => {
    if (!bill.isPaid || !bill.paidDate) return false;

    const paidDate = new Date(bill.paidDate);
    const today = new Date();

    return (
      paidDate.getMonth() === today.getMonth() &&
      paidDate.getFullYear() === today.getFullYear()
    );
  };

  // Filter bills into past due, upcoming, and paid this month
  const pastDueBills = bills.filter(isPastDue);
  const upcomingThisMonthBills = bills.filter(
    (bill) => !isPastDue(bill) && isUpcomingThisMonth(bill),
  );
  const paidThisMonthBills = bills.filter(isPaidThisMonth);

  // Calculate total outstanding balance for THIS month only
  const totalDue = [...pastDueBills, ...upcomingThisMonthBills].reduce(
    (sum, b) => sum + b.amount,
    0,
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            setLoading(true);
            fetchData();
          }}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          // Pull-to-refresh — standard mobile UX pattern
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{fullName} 👋</Text>
          </View>
          <View />
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{currentMonthYear}</Text>
          <Text style={styles.summaryLabel}>Outstanding Balance</Text>

          <Text style={styles.summaryAmount}>${totalDue.toFixed(2)}</Text>
        </View>

        {/* Past Due Bills Section */}
        {pastDueBills.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.pastDueTitle]}>
              Past Due ({pastDueBills.length})
            </Text>
            {pastDueBills.map((bill) => (
              <BillCard key={bill._id} bill={bill} isPastDue={true} />
            ))}
          </>
        )}

        {/* Upcoming Bills - Current Month */}
        {upcomingThisMonthBills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Upcoming Bills - {currentMonthYear} (
              {upcomingThisMonthBills.length})
            </Text>
            {upcomingThisMonthBills.map((bill) => (
              <BillCard key={bill._id} bill={bill} />
            ))}
          </>
        )}

        {upcomingThisMonthBills.length === 0 &&
          pastDueBills.length === 0 &&
          paidThisMonthBills.length === 0 && (
            <Text style={styles.emptyText}>No bills for this month.</Text>
          )}

        {/* Bills Paid This Month */}
        {paidThisMonthBills.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.billsPaidTitle]}>
              Bills Paid This Month ({paidThisMonthBills.length})
            </Text>
            {paidThisMonthBills.map((bill) => (
              <BillCard key={bill._id} bill={bill} />
            ))}
          </>
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  scroll: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: "#888",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },

  // Summary card
  summaryCard: {
    backgroundColor: "#007bff",
    borderRadius: 16,
    padding: 20,
    gap: 4,
    marginBottom: 8,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  summaryAmount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },

  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginTop: 4,
  },
  billsPaidTitle: {
    color: "#28a745",
  },
  pastDueTitle: {
    color: "#d9534f",
  },

  // Loading / error states
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  errorText: {
    fontSize: 14,
    color: "#d9534f",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
