import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { CreateBillDto, RecurrenceType } from "@/models/bill";
import { billService } from "@/services/billService";

const RECURRENCE_OPTIONS: RecurrenceType[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

export default function CreateBillScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [isPaid, setIsPaid] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>("monthly");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter a bill name.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Validation", "Please enter a valid positive amount.");
      return;
    }
    if (!dueDate.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      Alert.alert(
        "Validation",
        "Please enter a due date in YYYY-MM-DD format.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateBillDto = {
        name: name.trim(),
        amount: parsedAmount,
        dueDate,
        isPaid,
        isRecurring,
        recurrence: isRecurring ? recurrence : undefined,
      };
      await billService.createBill(payload);
      // Navigate back to dashboard after creation
      router.replace("/screens/DashboardScreen");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to create bill.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <Text style={styles.topTitle}>New Bill</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bill Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Netflix, Rent, Electric"
                placeholderTextColor="#bbb"
                returnKeyType="next"
              />
            </View>

            {/* Amount */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount ($) *</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>

            {/* Due Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Due Date *</Text>
              <TextInput
                style={styles.input}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#bbb"
                returnKeyType="done"
              />
            </View>

            {/* Mark as paid */}
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.label}>Mark as Paid</Text>
                <Text style={styles.toggleHint}>
                  Turn on if this bill is already settled
                </Text>
              </View>
              <Switch
                value={isPaid}
                onValueChange={setIsPaid}
                trackColor={{ true: "#007bff", false: "#ddd" }}
                thumbColor="#fff"
              />
            </View>

            {/* Recurring */}
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.label}>Recurring</Text>
                <Text style={styles.toggleHint}>Repeats on a schedule</Text>
              </View>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ true: "#007bff", false: "#ddd" }}
                thumbColor="#fff"
              />
            </View>

            {/* Recurrence frequency */}
            {isRecurring && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.chipRow}>
                  {RECURRENCE_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt}
                      style={[
                        styles.chip,
                        recurrence === opt && styles.chipActive,
                      ]}
                      onPress={() => setRecurrence(opt)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          recurrence === opt && styles.chipTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Submit button */}
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              submitting && styles.disabledButton,
              pressed && styles.pressed,
            ]}
            onPress={handleCreate}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Bill</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Returns today's date as YYYY-MM-DD
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f2f5" },

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
  pressed: { opacity: 0.65 },

  scroll: { padding: 16, gap: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  formGroup: { gap: 6, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fafafa",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  toggleHint: { fontSize: 12, color: "#aaa", marginTop: 1 },

  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 4 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  chipActive: { borderColor: "#007bff", backgroundColor: "#e8f0fe" },
  chipText: { fontSize: 13, color: "#555" },
  chipTextActive: { color: "#007bff", fontWeight: "600" },

  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  disabledButton: { opacity: 0.5 },
});
