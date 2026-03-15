import React from "react";
import { View, Text, StyleSheet, Pressable, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import type { Challenge } from "@/context/AppContext";

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
}

const DIFF_COLORS = {
  Beginner: "#10B981",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  "C#": "#9B4993",
  "C++": "#00599C",
};

export function ChallengeCard({ challenge, onPress }: ChallengeCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: challenge.completed ? (isDark ? "#00FF9D33" : "#10B98133") : colors.cardBorder,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: DIFF_COLORS[challenge.difficulty] + "22" }]}>
            <Text style={[styles.tagText, { color: DIFF_COLORS[challenge.difficulty] }]}>
              {challenge.difficulty}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: (LANG_COLORS[challenge.language] || "#888") + "22" }]}>
            <Text style={[styles.tagText, { color: LANG_COLORS[challenge.language] || "#888" }]}>
              {challenge.language}
            </Text>
          </View>
        </View>
        {challenge.completed ? (
          <View style={[styles.completedBadge, { backgroundColor: isDark ? "#00FF9D22" : "#10B98122" }]}>
            <Feather name="check-circle" size={14} color={isDark ? "#00FF9D" : "#10B981"} />
          </View>
        ) : (
          <View style={[styles.xpBadge, { backgroundColor: colors.backgroundTertiary }]}>
            <Feather name="zap" size={11} color={colors.accent} />
            <Text style={[styles.xpText, { color: colors.accent }]}>+{challenge.xpReward}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{challenge.title}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
        {challenge.description}
      </Text>
      <View style={styles.footer}>
        <Feather name="code" size={12} color={colors.textMuted} />
        <Text style={[styles.footerText, { color: colors.textMuted }]}>Tap to solve</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tags: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  desc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
