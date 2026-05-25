import { ScrollView, StyleSheet, Text } from "react-native";
import React from "react";
import BottomNav from "../_components/BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FaithScriptureScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emptyText}>Faith scripture view coming soon!</Text>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
