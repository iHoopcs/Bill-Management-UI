import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={{ uri: "https://picsum.photos/seed/picsum/200/300" }}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay darkens the image so text is readable over any photo */}
      <View style={styles.overlay} />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>BillManager</Text>
        <Text style={styles.subtitle}>Take control of your finances</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.loginButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/screens/LoginScreen")}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.registerButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/screens/RegisterScreen")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  buttonContainer: {
    padding: 24,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#007bff",
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
