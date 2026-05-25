import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function LoginScreen() {
  const { registered } = useLocalSearchParams<{ registered?: string }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Ref lets us move focus from email → password when user taps "Next" on keyboard
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = () => {
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // TODO: replace with real auth call
    if (email === "test@test.com" && password === "password") {
      router.replace("/screens/DashboardScreen");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    // KeyboardAvoidingView pushes content up so the keyboard doesn't cover inputs
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>BillManager</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {/* Success banner shown after registration */}
        {registered === "true" && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>Account created!</Text>
          </View>
        )}

        {/* Email input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none" // don't capitalise email addresses
            keyboardType="email-address"
            returnKeyType="next" // keyboard shows "Next" instead of "Done"
            onSubmitEditing={() => passwordRef.current?.focus()} // move to password
          />
        </View>

        {/* Password input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            ref={passwordRef}
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // hides characters
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
        </View>

        {/* Error message — only shown when error is set */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <View style={styles.registerTextContainer}>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text
              style={styles.registerLink}
              onPress={() => router.push("/screens/RegisterScreen")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 28,
    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow (Android)
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 28,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fafafa",
  },
  error: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 12,
  },
  successBanner: {
    backgroundColor: "#e6f4ea",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#34a853",
  },
  successText: {
    color: "#1e7e34",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerTextContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    color: "#007bff",
    fontWeight: "600",
  },
});
