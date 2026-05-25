import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Displays a single bill in the list on the Dashboard. Shows name, due date, amount, and paid/due status.
 * Tapping the card navigates to the BillDetailScreen for that bill.
 * @param Bill - The bill data to display in the card
 * @returns A styled Pressable card component representing a bill
 */
export default function BillCard({ bill }: { bill: Bill }) {
  const router = useRouter();

  return (
    <>
      <Pressable
        key={bill._id}
        style={({ pressed }) => [styles.billCard, pressed && styles.pressed]}
        onPress={() => router.push(`/screens/BillDetailScreen?id=${bill._id}`)}
      >
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
            <Text style={styles.badgeText}>{bill.isPaid ? "Paid" : "Due"}</Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
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
  pressed: {
    opacity: 0.7,
  },
});
