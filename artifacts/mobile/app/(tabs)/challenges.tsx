import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { ChallengeCard } from "@/components/ChallengeCard";

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ChallengesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { challenges, profile } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 10;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 80;

  const filtered = activeFilter === "All"
    ? challenges
    : challenges.filter((c) => c.difficulty === activeFilter);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Challenges</Text>
        <Text style={[styles.screenSub, { color: colors.textSecondary }]}>
          Sharpen your coding skills
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: isDark ? "#0D1B2E" : "#EFF6FF", borderColor: isDark ? "#1E3A5F" : "#BFDBFE" }]}>
          <Feather name="check-circle" size={18} color={colors.accent} />
          <Text style={[styles.statNum, { color: colors.text }]}>{completedCount}/{challenges.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Solved</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? "#0D1B2E" : "#FFF7ED", borderColor: isDark ? "#1E3A5F" : "#FED7AA" }]}>
          <Feather name="zap" size={18} color="#FF6B35" />
          <Text style={[styles.statNum, { color: colors.text }]}>{totalXP}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP earned</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? "#0D1B2E" : "#F0FDF4", borderColor: isDark ? "#1E3A5F" : "#BBF7D0" }]}>
          <Feather name="trending-up" size={18} color="#10B981" />
          <Text style={[styles.statNum, { color: colors.text }]}>{profile.level}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Level</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilter === f ? colors.accent : colors.card,
                borderColor: activeFilter === f ? colors.accent : colors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === f ? "#FFFFFF" : colors.textSecondary },
              ]}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.challengesList}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="code" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No challenges yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              More coming soon!
            </Text>
          </View>
        ) : (
          filtered.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onPress={() => router.push(`/challenge/${challenge.id}`)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 4,
  },
  screenTitle: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  screenSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  statNum: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filters: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  challengesList: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
