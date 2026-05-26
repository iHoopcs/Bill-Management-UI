import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../_components/BottomNav";
import { useState } from "react";
import { MONTH_NAMES_FULL, DAYS_IN_MONTH } from "@/utils/monthsOfYear";

export default function CalendarScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [monthView, setMonthView] = useState<string | null>(null);

  
  const onRefresh = () => {
    setRefreshing(true);
    // Send request for calendar data
  };

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
        <View style={styles.header}>
          <Text style={styles.greeting}>Calendar</Text>
        </View>

        {/* Days of the month */}
        <View style={styles.daysContainer}>
          {MONTH_NAMES_FULL.map((month) => (
            <View key={month} style={styles.monthCard}>
              <Text style={styles.monthName}>{month}</Text>
              {/* // Show days in month as a simple list for now - can be enhanced to a grid later */}

              {DAYS_IN_MONTH[MONTH_NAMES_FULL.indexOf(month)] > 0 ? (
                <View style={styles.monthGrid}>
                  {Array.from(
                    { length: DAYS_IN_MONTH[MONTH_NAMES_FULL.indexOf(month)] },
                    (_, i) => i + 1,
                  ).map((day) => (
                    <Text key={day} style={styles.day}>
                      {day}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    fontFamily: "System",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  monthCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  monthGrid: {
    marginTop: 8,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
  },
  day: {
    fontSize: 12,
    color: "#555",
    fontWeight: "800",
  },
});
