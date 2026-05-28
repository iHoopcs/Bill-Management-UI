import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function DayDetailsModal(props: {
  day: number;
  billsOnThisDay?: any[]; // Replace with actual bill type
}) {
  return (
    <View>
      <Text>Day: {props.day}</Text>

      {/* Render bills w/ details for this day */}
      {props.billsOnThisDay?.map((bill, index) => (
        <Text key={index}>{bill.name}</Text> // Replace `bill.name` with actual bill property
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
