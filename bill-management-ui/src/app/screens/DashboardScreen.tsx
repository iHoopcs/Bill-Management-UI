import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// --- Dummy data — replace with real API calls ---
const DUMMY_USER = {
  name: "Caleb",
};

const DUMMY_BILLS = [
  {
    id: "1",
    name: "Electricity",
    amount: 120.5,
    dueDate: "Jun 1",
    paid: false,
  },
  { id: "2", name: "Internet", amount: 59.99, dueDate: "Jun 3", paid: false },
  { id: "3", name: "Rent", amount: 1200, dueDate: "Jun 5", paid: true },
  { id: "4", name: "Netflix", amount: 15.99, dueDate: "Jun 8", paid: true },
];

const totalDue = DUMMY_BILLS.filter((b) => !b.paid).reduce(
  (sum, b) => sum + b.amount,
  0,
);

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{DUMMY_USER.name} 👋</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.replace("/screens/LoginScreen")}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Outstanding Balance</Text>
          <Text style={styles.summaryAmount}>${totalDue.toFixed(2)}</Text>
          <Text style={styles.summarySubtext}>
            {DUMMY_BILLS.filter((b) => !b.paid).length} bill(s) due soon
          </Text>
        </View>

        {/* Bills list */}
        <Text style={styles.sectionTitle}>Upcoming Bills</Text>

        {DUMMY_BILLS.map((bill) => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{bill.name}</Text>
              <Text style={styles.billDue}>Due {bill.dueDate}</Text>
            </View>
            <View style={styles.billRight}>
              <Text style={styles.billAmount}>${bill.amount.toFixed(2)}</Text>
              <View
                style={[
                  styles.badge,
                  bill.paid ? styles.badgePaid : styles.badgeDue,
                ]}
              >
                <Text style={styles.badgeText}>
                  {bill.paid ? "Paid" : "Due"}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  scroll: {
    padding: 20,
    gap: 12,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: "#888",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  logoutText: {
    fontSize: 13,
    color: "#555",
  },
  pressed: {
    opacity: 0.7,
  },

  // Summary card
  summaryCard: {
    backgroundColor: "#007bff",
    borderRadius: 16,
    padding: 24,
    gap: 4,
    marginBottom: 8,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  summaryAmount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  summarySubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },

  // Bill cards
  billCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  billInfo: {
    gap: 4,
  },
  billName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  billDue: {
    fontSize: 12,
    color: "#888",
  },
  billRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  billAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgePaid: {
    backgroundColor: "#e6f4ea",
  },
  badgeDue: {
    backgroundColor: "#fff0f0",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#444",
  },
});
