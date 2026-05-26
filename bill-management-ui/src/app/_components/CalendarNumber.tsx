import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function CalendarNumber(props: {
  day: number;
  hasBill?: boolean;
}) {
  return (
    <View style={[styles.dayCell, props.hasBill && styles.hasBill]}>
      {props.hasBill ? (
        <Text style={[styles.day, styles.hasBill]}>{props.day}</Text>
      ) : (
        <Text style={styles.day}>{props.day}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dayCell: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  day: {
    fontSize: 14,
    color: "#333",
  },
  hasBill: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
  },
});
