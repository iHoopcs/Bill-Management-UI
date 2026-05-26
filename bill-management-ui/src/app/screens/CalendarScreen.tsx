import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../_components/BottomNav";
import { useState } from "react";
import { MONTH_NAMES_FULL, DAYS_IN_MONTH } from "@/utils/monthsOfYear";
import CalendarNumber from "../_components/CalendarNumber";

export default function CalendarScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] =
    useState(currentMonthIndex);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Send request for calendar data
    setRefreshing(false);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          //Pull-to-refresh - standard mobile UX pattern
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar Title with Month Dropdown */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Calendar</Text>

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
            {calendarDays.map((item) =>
              item.day ? (
                <CalendarNumber key={item.key} day={item.day} hasBill={false} />
              ) : (
                <View key={item.key} style={styles.emptyCell} />
              ),
            )}
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
    gap: 12,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    fontFamily: "System",
    marginBottom: 12,
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
    minWidth: 200,
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
});
