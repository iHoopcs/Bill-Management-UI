import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { User } from "@/models/user";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import BottomNav from "@/app/_components/BottomNav";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getUser()
      .then(setUser)
      .catch((err: any) => setError(err.message ?? "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "�";
  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.fullName}>{fullName}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* Info card */}
        <View style={styles.card}>
          <Row label="First name" value={user?.firstName ?? "�"} />
          <Divider />
          <Row label="Last name" value={user?.lastName ?? "�"} />
          <Divider />
          <Row label="Email" value={user?.email ?? "�"} />
          <Divider />
          <Row
            label="Member since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "�"
            }
          />
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={() => authService.logout()}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

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

  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 8,
  },

  // Avatar
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#fff" },

  fullName: { fontSize: 20, fontWeight: "700", color: "#111" },
  email: { fontSize: 13, color: "#888", marginBottom: 16 },

  // Info card
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 14, color: "#555" },
  rowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
    maxWidth: "60%",
    textAlign: "right",
  },
  divider: { height: 1, backgroundColor: "#f0f0f0" },

  // Logout
  logoutButton: {
    width: "100%",
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9534f",
    alignItems: "center",
  },
  logoutText: { color: "#d9534f", fontWeight: "700", fontSize: 15 },
  pressed: { opacity: 0.65 },
});
