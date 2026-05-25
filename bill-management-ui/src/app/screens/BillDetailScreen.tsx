import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { Bill, RecurrenceType, UpdateBillDto } from "@/models/bill";
import { billService } from "@/services/billService";

const RECURRENCE_OPTIONS: RecurrenceType[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

export default function BillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>("monthly");

  useEffect(() => {
    if (!id) {
      setError("No bill ID provided.");
      setLoading(false);
      return;
    }
    loadBill();
  }, [id]);

  const loadBill = async () => {
    try {
      setError(null);
      const data = await billService.getBill(id!);
      setBill(data);
      populateFields(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load bill.");
    } finally {
      setLoading(false);
    }
  };

  const populateFields = (b: Bill) => {
    setName(b.name);
    setAmount(b.amount.toString());
    setDueDate(b.dueDate.split("T")[0]); // keep YYYY-MM-DD only
    setIsPaid(b.isPaid);
    setIsRecurring(b.isRecurring);
    setRecurrence(b.recurrence ?? "monthly");
  };

  const handleSave = async () => {
    if (!name.trim() || !amount.trim() || !dueDate.trim()) {
      Alert.alert("Validation", "Name, amount, and due date are required.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Validation", "Amount must be a positive number.");
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateBillDto = {
        name: name.trim(),
        amount: parsedAmount,
        dueDate,
        isPaid,
        isRecurring,
        recurrence: isRecurring ? recurrence : undefined,
      };
      const updated = await billService.updateBill(id!, payload);
      setBill(updated);
      populateFields(updated);
      setIsEditing(false);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Bill",
      `Are you sure you want to delete "${bill?.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await billService.deleteBill(id!);
              router.replace("/screens/DashboardScreen");
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "Failed to delete bill.");
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleCancelEdit = () => {
    if (bill) populateFields(bill);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading bill...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.topTitle}>Bill Details</Text>
        <View style={styles.topRight}>
          {!isEditing ? (
            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
              onPress={handleCancelEdit}
            >
              <Text style={[styles.editText, { color: "#888" }]}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Status badge */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              bill?.isPaid ? styles.badgePaid : styles.badgeDue,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {bill?.isPaid ? "✓  Paid" : "⏰  Due"}
            </Text>
          </View>
          {bill?.isRecurring && (
            <View style={styles.recurringBadge}>
              <Text style={styles.recurringText}>🔄 {bill.recurrence}</Text>
            </View>
          )}
        </View>

        {/* Fields */}
        <View style={styles.card}>
          <Field
            label="Bill Name"
            value={name}
            editable={isEditing}
            onChangeText={setName}
            placeholder="e.g. Netflix"
          />
          <Divider />
          <Field
            label="Amount ($)"
            value={amount}
            editable={isEditing}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
          <Divider />
          <Field
            label="Due Date"
            value={dueDate}
            editable={isEditing}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD"
          />
          <Divider />

          {/* Paid toggle */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Paid</Text>
            {isEditing ? (
              <Switch
                value={isPaid}
                onValueChange={setIsPaid}
                trackColor={{ true: "#007bff", false: "#ddd" }}
                thumbColor="#fff"
              />
            ) : (
              <Text style={styles.fieldValue}>{isPaid ? "Yes" : "No"}</Text>
            )}
          </View>
          <Divider />

          {/* Recurring toggle */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Recurring</Text>
            {isEditing ? (
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ true: "#007bff", false: "#ddd" }}
                thumbColor="#fff"
              />
            ) : (
              <Text style={styles.fieldValue}>
                {isRecurring ? "Yes" : "No"}
              </Text>
            )}
          </View>

          {/* Recurrence type – only visible when recurring */}
          {isRecurring && (
            <>
              <Divider />
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Frequency</Text>
                {isEditing ? (
                  <View style={styles.recurrenceRow}>
                    {RECURRENCE_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt}
                        style={[
                          styles.recurrenceChip,
                          recurrence === opt && styles.recurrenceChipActive,
                        ]}
                        onPress={() => setRecurrence(opt)}
                      >
                        <Text
                          style={[
                            styles.recurrenceChipText,
                            recurrence === opt &&
                              styles.recurrenceChipTextActive,
                          ]}
                        >
                          {opt}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>{recurrence}</Text>
                )}
              </View>
            </>
          )}
        </View>

        {/* Meta info */}
        {bill && (
          <View style={styles.metaCard}>
            <Text style={styles.metaText}>
              Created: {new Date(bill.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.metaText}>
              Updated: {new Date(bill.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Action buttons */}
        {isEditing && (
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              (saving || deleting) && styles.disabledButton,
              pressed && styles.pressed,
            ]}
            onPress={handleSave}
            disabled={saving || deleting}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            (saving || deleting) && styles.disabledButton,
            pressed && styles.pressed,
          ]}
          onPress={handleDelete}
          disabled={saving || deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteText}>Delete Bill</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// Small reusable components ---------------------------------------------------

function Field({
  label,
  value,
  editable,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  editable: boolean;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "decimal-pad";
}) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editable ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType ?? "default"}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

// Styles ----------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f2f5" },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: "#888" },
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
  retryText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { paddingVertical: 4, paddingHorizontal: 4 },
  backText: { color: "#007bff", fontSize: 15 },
  topTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  topRight: { width: 60, alignItems: "flex-end" },
  editButton: { paddingVertical: 4, paddingHorizontal: 4 },
  editText: { color: "#007bff", fontSize: 15 },
  pressed: { opacity: 0.65 },

  scroll: { padding: 16, gap: 12 },

  // Status badges
  statusRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  badgePaid: { backgroundColor: "#e6f4ea" },
  badgeDue: { backgroundColor: "#fff0f0" },
  statusBadgeText: { fontSize: 13, fontWeight: "600", color: "#333" },
  recurringBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#e8f0fe",
  },
  recurringText: { fontSize: 13, fontWeight: "600", color: "#333" },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: "#f0f0f0" },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  fieldLabel: { fontSize: 14, color: "#555", flex: 1 },
  fieldValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
    flex: 2,
    textAlign: "right",
  },
  fieldInput: {
    flex: 2,
    fontSize: 15,
    color: "#111",
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: "#007bff",
    paddingBottom: 2,
  },

  // Recurrence chips
  recurrenceRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  recurrenceChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  recurrenceChipActive: {
    borderColor: "#007bff",
    backgroundColor: "#e8f0fe",
  },
  recurrenceChipText: { fontSize: 12, color: "#555" },
  recurrenceChipTextActive: { color: "#007bff", fontWeight: "600" },

  // Meta
  metaCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  metaText: { fontSize: 12, color: "#aaa" },

  // Buttons
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  deleteButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d9534f",
  },
  deleteText: { color: "#d9534f", fontWeight: "700", fontSize: 15 },
  disabledButton: { opacity: 0.5 },
});
