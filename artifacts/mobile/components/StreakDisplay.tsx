import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface StreakDisplayProps {
  streak: number;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: "#FF6B3522" }]}>
      <View style={styles.iconRow}>
        <Feather name="zap" size={18} color="#FF6B35" />
        <Text style={[styles.streakNumber, { color: "#FF6B35" }]}>{String(streak)}</Text>
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 2,
    minWidth: 72,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  streakNumber: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FF6B35",
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
