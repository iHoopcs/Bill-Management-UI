import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getOrdinalSuffix } from "@/utils/calendarUtils";

export default function DayDetailsModal(props: {
  day: number;
  billsOnThisDay?: any[]; // Replace with actual bill type
  selectedMonth?: string;
}) {
  // Simple divider component for separating bill details
  function Divider() {
    return <View style={styles.divider} />;
  }

  return (
    <View>
      <Text style={styles.billDayTitle}>
        {props.selectedMonth} {props.day}
        {getOrdinalSuffix(props.day)} {""} Bills
      </Text>
      {/* Render bills w/ details for this day */}
      {props.billsOnThisDay?.map((bill, index) => (
        <>
          <View key={index} style={styles.billRow}>
            <Text style={styles.billDetail}>
              <Text style={styles.billName}>{bill.name}</Text> -{" "}
              <Text style={styles.billAmount}>${bill.amount}</Text>
            </Text>
            {bill.isPaid && <Text style={styles.checkmark}>✓</Text>}
          </View>
          {index < (props.billsOnThisDay?.length ?? 0) - 1 && <Divider />}
        </>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  billDayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
  billDetail: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  billAmount: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  billName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
    fontStyle: "italic",
    textAlign: "center",
  },
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  checkmark: {
    fontSize: 16,
    color: "#34a853",
    fontWeight: "bold",
    marginBottom: 4,
  },
  divider: { height: 1, backgroundColor: "#f0f0f0" },
});
