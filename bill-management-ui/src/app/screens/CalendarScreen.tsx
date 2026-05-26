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

export default function CalendarScreen() {
  const [refreshing, setRefreshing] = useState(false);

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
});
