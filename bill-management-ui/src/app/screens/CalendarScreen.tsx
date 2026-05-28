import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../_components/BottomNav";
import { useEffect, useState } from "react";
import { MONTH_NAMES_FULL, DAYS_IN_MONTH } from "@/utils/calendarUtils";
import CalendarNumber from "../_components/CalendarNumber";
import { Bill } from "@/models/bill";
import { billService } from "@/services/billService";

export default function CalendarScreen() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] =
    useState(currentMonthIndex);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  //Fetch bills for the month when the screen loads or when the month changes
  const fetchBills = async () => {
    try {
      setError(null);
      // Fetch bills for the user
      const billsData = await billService.getBillsForUser();
      setBills(billsData);
    } catch (err: any) {
      setError(err.message ?? "Failed to load bills.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Runs once when the screen mounts
  useEffect(() => {
    fetchBills();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBills();
  };

  // Get the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar grid with empty cells for alignment
  const generateCalendarDays = () => {
    const year = new Date().getFullYear();
    const firstDay = getFirstDayOfMonth(year, selectedMonthIndex);
    const daysInMonth = DAYS_IN_MONTH[selectedMonthIndex];
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: null, key: `empty-${i}` });
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({ day, key: `day-${day}` });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading your bills...</Text>
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
            fetchBills();
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
          //Pull-to-refresh - standard mobile UX pattern
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar Title */}
        <Text style={styles.greeting}>Calendar</Text>

        {/* Month Dropdown */}
        <View style={styles.dropdownContainer}>
          <Pressable
            style={styles.dropdown}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {MONTH_NAMES_FULL[selectedMonthIndex]} {new Date().getFullYear()}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </Pressable>
        </View>

        {/* Month Dropdown Modal */}
        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <ScrollView>
                {MONTH_NAMES_FULL.map((month, index) => (
                  <Pressable
                    key={month}
                    style={[
                      styles.monthOption,
                      selectedMonthIndex === index && styles.selectedMonth,
                    ]}
                    onPress={() => {
                      setSelectedMonthIndex(index);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.monthOptionText,
                        selectedMonthIndex === index &&
                          styles.selectedMonthText,
                      ]}
                    >
                      {month}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>

        {/* Days of the selected month */}
        <View style={styles.monthCard}>
          <Text style={styles.monthName}>
            {MONTH_NAMES_FULL[selectedMonthIndex]}
          </Text>

          {/* Day of week headers */}
          <View style={styles.weekHeader}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.monthGrid}>
            {calendarDays.map((item) => {
              // If it's an empty cell (for alignment), render an invisible placeholder
              if (!item.day) {
                return <View key={item.key} style={styles.emptyCell} />;
              }

              const currentYear = new Date().getFullYear();

              // Check if any bill is due on this specific day
              const billsOnThisDay = bills.filter((bill) => {
                // Monthly bills - check if recurring day matches
                if (
                  bill.recurrence === "monthly" &&
                  bill.recurringDayOfMonth === item.day
                ) {
                  return true;
                }

                // Yearly bills - check if it's due this month and this day
                if (
                  bill.recurrence === "yearly" &&
                  bill.yearlyDueMonth === selectedMonthIndex + 1 && // months are 1-indexed in bill data
                  bill.yearlyDueDay === item.day
                ) {
                  return true;
                }

                return false;
              });

              const hasBill = billsOnThisDay.length > 0;

              // Check if all bills on this day are paid for THIS specific month/year
              const allPaid =
                hasBill &&
                billsOnThisDay.every((bill) => {
                  if (!bill.isPaid || !bill.paidDate) return false;

                  const paidDate = new Date(bill.paidDate);
                  const paidMonth = paidDate.getMonth();
                  const paidYear = paidDate.getFullYear();

                  // For monthly bills, check if paid in the selected month/year
                  // (doesn't matter which day of the month it was paid)
                  if (bill.recurrence === "monthly") {
                    return (
                      paidMonth === selectedMonthIndex &&
                      paidYear === currentYear
                    );
                  }

                  // For yearly bills, check if paid in the selected month/year
                  // (doesn't matter which day it was paid)
                  if (bill.recurrence === "yearly") {
                    return (
                      paidMonth === selectedMonthIndex &&
                      paidYear === currentYear
                    );
                  }

                  return false;
                });

              return (
                <CalendarNumber
                  key={item.key}
                  day={item.day}
                  hasBill={hasBill}
                  isPaid={allPaid}
                  selectedMonth={MONTH_NAMES_FULL[selectedMonthIndex]}
                />
              );
            })}
          </View>
        </View>
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
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    fontFamily: "System",
    marginBottom: 16,
    width: "100%",
  },
  dropdownContainer: {
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 220,
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    maxHeight: "70%",
    padding: 8,
  },
  monthOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedMonth: {
    backgroundColor: "#e6f2ff",
  },
  monthOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedMonthText: {
    fontWeight: "bold",
    color: "#007bff",
  },
  monthCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  monthName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dayHeader: {
    width: 45,
    alignItems: "center",
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  emptyCell: {
    width: 45,
    height: 45,
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
  pressed: {
    opacity: 0.7,
  },
});
