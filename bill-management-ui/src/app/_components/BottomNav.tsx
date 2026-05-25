import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, usePathname } from "expo-router";

import { authService } from "@/services/authService";

/**
 * Bottom navigation bar shared across all main app screens.
 *
 * Active tab is derived automatically from the current route so callers
 * don't need to pass any props.
 */
export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (screen: string) => pathname.includes(screen);

  return (
    <View style={styles.bottomNav}>
      {/* Dashboard */}
      <Pressable
        style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
        onPress={() => router.push("/screens/DashboardScreen")}
      >
        <Text
          style={
            isActive("DashboardScreen") ? styles.navIconActive : styles.navIcon
          }
        >
          ⊞
        </Text>
        <Text
          style={
            isActive("DashboardScreen")
              ? styles.navLabelActive
              : styles.navLabel
          }
        >
          Dashboard
        </Text>
      </Pressable>

      {/* Calendar */}
      <Pressable
        style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
        onPress={() => router.push("/screens/CalendarScreen")}
      >
        <Text
          style={
            isActive("CalendarScreen") ? styles.navIconActive : styles.navIcon
          }
        >
          📅
        </Text>
        <Text
          style={
            isActive("CalendarScreen") ? styles.navLabelActive : styles.navLabel
          }
        >
          Calendar
        </Text>
      </Pressable>

      {/* Add bill — centre floating button */}
      <Pressable
        style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
        onPress={() => router.push("/screens/CreateBillScreen")}
      >
        <View style={styles.navAddButton}>
          <Text style={styles.navAddIcon}>＋</Text>
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
        onPress={() => router.push("/screens/FaithScriptureScreen")}
      >
        <Text
          style={
            isActive("FaithScriptureScreen")
              ? styles.navIconActive
              : styles.navIcon
          }
        >
          📖
        </Text>
        <Text
          style={
            isActive("FaithScriptureScreen")
              ? styles.navLabelActive
              : styles.navLabel
          }
        >
          Faith
        </Text>
      </Pressable>

      {/* Profile */}
      <Pressable
        style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
        onPress={() => router.push("/screens/ProfileScreen")}
      >
        <Text
          style={
            isActive("ProfileScreen") ? styles.navIconActive : styles.navIcon
          }
        >
          👤
        </Text>
        <Text
          style={
            isActive("ProfileScreen") ? styles.navLabelActive : styles.navLabel
          }
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    height: 64,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  pressed: { opacity: 0.65 },
  navIcon: {
    fontSize: 20,
    color: "#aaa",
  },
  navIconActive: {
    fontSize: 20,
    color: "#007bff",
  },
  navLabel: {
    fontSize: 11,
    color: "#aaa",
  },
  navLabelActive: {
    fontSize: 11,
    color: "#007bff",
    fontWeight: "600",
  },
  navAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 8,
  },
  navAddIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 28,
  },
});
