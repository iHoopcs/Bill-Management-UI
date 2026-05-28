import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getOrdinalSuffix } from "@/utils/calendarUtils";

export default function DayDetailsModal(props: {
  day: number;
  billsOnThisDay?: any[]; // Replace with actual bill type
  selectedMonth?: string;
}) {
  return (
    <View>
      <Text style={styles.billDayTitle}>
        {props.selectedMonth} {props.day}
        {getOrdinalSuffix(props.day)} {""} Bills
      </Text>
      {/* Render bills w/ details for this day */}
      {props.billsOnThisDay?.map((bill, index) => (
        <Text key={index}>{bill.name}</Text>
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
  },
});
