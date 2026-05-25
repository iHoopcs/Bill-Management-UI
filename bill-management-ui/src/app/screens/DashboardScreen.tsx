import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function DashboardScreen() {
  return (
    <>
      <ImageBackground
        source={{ uri: "https://picsum.photos/seed/picsum/200/300" }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>Welcome, User!</Text>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
