import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Bill } from "@/models/bill";
import { User } from "@/models/user";
import { authService } from "@/services/authService";
import { billService } from "@/services/billService";
import { userService } from "@/services/userService";

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      // Fetch user and bills in parallel — faster than sequential awaits
      const [userData, billsData] = await Promise.all([
        userService.getUser(),
        billService.getBillsForUser(),
      ]);
      setUser(userData);
      setBills(billsData);
    } catch (err: any) {
      setError(err.message ?? "Failed to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Runs once when the screen mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const totalDue = bills
    .filter((b) => !b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0);

  const unpaidCount = bills.filter((b) => !b.isPaid).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            setLoading(true);
            fetchData();
          }}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          // Pull-to-refresh — standard mobile UX pattern
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.firstName ?? "there"} 👋</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressed,
            ]}
            onPress={() => authService.logout()}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Outstanding Balance</Text>
          <Text style={styles.summaryAmount}>${totalDue.toFixed(2)}</Text>
          <Text style={styles.summarySubtext}>
            {unpaidCount} bill{unpaidCount !== 1 ? "s" : ""} due soon
          </Text>
        </View>

        {/* Bills list */}
        <Text style={styles.sectionTitle}>Upcoming Bills</Text>

        {bills.length === 0 ? (
          <Text style={styles.emptyText}>No bills found.</Text>
        ) : (
          bills.map((bill) => (
            <View key={bill._id} style={styles.billCard}>
              <View style={styles.billInfo}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billDue}>
                  Due {new Date(bill.dueDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.billRight}>
                <Text style={styles.billAmount}>${bill.amount.toFixed(2)}</Text>
                <View
                  style={[
                    styles.badge,
                    bill.isPaid ? styles.badgePaid : styles.badgeDue,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {bill.isPaid ? "Paid" : "Due"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
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

  // Loading / error states
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  errorText: {
    fontSize: 14,
    color: "#d9534f",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
  },
});
