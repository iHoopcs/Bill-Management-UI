import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { router } from "expo-router";

export default function WelcomeScreen() {
  const handleLogin = () => {
    console.log("Logging in...");
    router.push("/screens/LoginScreen");
  };

  const handleRegister = () => {
    console.log("Registering...");
    router.push("/screens/RegisterScreen");
  };
  return (
    <ImageBackground
      source={{ uri: "https://picsum.photos/seed/picsum/200/300" }}
      style={styles.background}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.text}>Welcome to Bill Management App!</Text>
      </View>
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontStyle: "italic",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    paddingVertical: 25,
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#2196F3",
    paddingVertical: 25,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontStyle: "normal",
    color: "#333",
  },
  titleContainer: {
    position: "absolute",
    top: 50,
  },
});
