import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Bill } from "@/models/bill";
import { useState } from "react";

export default function CalendarNumber(props: {
  day: number;
  hasBill?: boolean;
  isPaid?: boolean;
  billsOnThisDay?: Bill[];
}) {
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false);

  return (
    <>
      {/* // Onpress day --> open modal with bill details for that day */}
      <View
        style={[
          styles.dayCell,
          props.hasBill && !props.isPaid && styles.hasBill,
          props.hasBill && props.isPaid && styles.billsPaid,
        ]}
      >
        <Pressable onPress={() => setDayDetailsVisible(true)}>
          {props.hasBill && props.isPaid ? (
            <Text style={[styles.day, styles.paidText]}>{props.day}</Text>
          ) : props.hasBill ? (
            <Text style={[styles.day, styles.unpaidText]}>{props.day}</Text>
          ) : (
            <Text style={styles.day}>{props.day}</Text>
          )}
        </Pressable>
      </View>

      {/* Modal for day details */}
      <Modal
        visible={dayDetailsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDayDetailsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDayDetailsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text>Bill details for day {props.day}</Text>
            {/* Render bill details here */}
          </View>
        </Pressable>
      </Modal>
    </>
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
    fontWeight: "200",
  },
  // Highlight days with unpaid bills
  hasBill: {
    backgroundColor: "#ffc107",
  },
  unpaidText: {
    color: "#000",
    fontWeight: "bold",
  },
  // Highlight day all bills are paid
  billsPaid: {
    backgroundColor: "#28a745",
  },
  paidText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
});
