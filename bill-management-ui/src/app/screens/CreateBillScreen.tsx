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

const RECURRENCE_OPTIONS: (RecurrenceType | null)[] = [
  null,
  "monthly",
  "yearly",
];
const RECURRENCE_LABELS: Record<string, string> = {
  none: "None",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function CreateBillScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType | null>(null);
  // Monthly fields
  const [recurringDayOfMonth, setRecurringDayOfMonth] = useState("");
  // Yearly fields
  const [yearlyDueMonth, setYearlyDueMonth] = useState("");
  const [yearlyDueDay, setYearlyDueDay] = useState("");
  // Optional fields
  const [reminderDays, setReminderDays] = useState("3");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter a bill name.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Validation", "Please enter a valid positive amount.");
      return;
    }
    if (recurrence === "monthly") {
      const day = parseInt(recurringDayOfMonth);
      if (!recurringDayOfMonth || isNaN(day) || day < 1 || day > 31) {
        Alert.alert(
          "Validation",
          "Please enter a valid day of the month (1–31).",
        );
        return;
      }
    }
    if (recurrence === "yearly") {
      const month = parseInt(yearlyDueMonth);
      const day = parseInt(yearlyDueDay);
      if (!yearlyDueMonth || isNaN(month) || month < 1 || month > 12) {
        Alert.alert("Validation", "Please enter a valid month (1–12).");
        return;
      }
      if (!yearlyDueDay || isNaN(day) || day < 1 || day > 31) {
        Alert.alert("Validation", "Please enter a valid day (1–31).");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: CreateBillDto = {
        name: name.trim(),
        amount: parsedAmount,
        isPaid,
        recurrence: recurrence ?? null,
        recurringDayOfMonth:
          recurrence === "monthly" ? parseInt(recurringDayOfMonth) : null,
        yearlyDueMonth:
          recurrence === "yearly" ? parseInt(yearlyDueMonth) : null,
        yearlyDueDay: recurrence === "yearly" ? parseInt(yearlyDueDay) : null,
        reminderDays: parseInt(reminderDays) || 3,
        notes: notes.trim() || null,
      };
      await billService.createBill(payload);
      Alert.alert("Success", "Bill created.", [
        {
          text: "OK",
          onPress: () => router.replace("/screens/DashboardScreen"),
        },
      ]);
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

            {/* Recurrence type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Recurrence</Text>
              <View style={styles.chipRow}>
                {RECURRENCE_OPTIONS.map((opt) => {
                  const key = opt ?? "none";
                  return (
                    <Pressable
                      key={key}
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
                        {RECURRENCE_LABELS[key]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Monthly: day of month */}
            {recurrence === "monthly" && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Day of Month (1–31) *</Text>
                <TextInput
                  style={styles.input}
                  value={recurringDayOfMonth}
                  onChangeText={setRecurringDayOfMonth}
                  placeholder="e.g. 1"
                  placeholderTextColor="#bbb"
                  keyboardType="number-pad"
                  returnKeyType="done"
                />
              </View>
            )}

            {/* Yearly: month + day */}
            {recurrence === "yearly" && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Month (1–12) *</Text>
                  <TextInput
                    style={styles.input}
                    value={yearlyDueMonth}
                    onChangeText={setYearlyDueMonth}
                    placeholder="e.g. 3 for March"
                    placeholderTextColor="#bbb"
                    keyboardType="number-pad"
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Day (1–31) *</Text>
                  <TextInput
                    style={styles.input}
                    value={yearlyDueDay}
                    onChangeText={setYearlyDueDay}
                    placeholder="e.g. 15"
                    placeholderTextColor="#bbb"
                    keyboardType="number-pad"
                    returnKeyType="done"
                  />
                </View>
              </>
            )}

            {/* Reminder days */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Reminder (days before due)</Text>
              <TextInput
                style={styles.input}
                value={reminderDays}
                onChangeText={setReminderDays}
                placeholder="3"
                placeholderTextColor="#bbb"
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional notes..."
                placeholderTextColor="#bbb"
                multiline
                returnKeyType="done"
              />
            </View>
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
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
