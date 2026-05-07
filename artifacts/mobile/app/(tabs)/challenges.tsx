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

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];

const DIFF_COLORS = {
  Beginner: "#16A34A",
  Intermediate: "#D97706",
  Advanced: "#DC2626",
};

export default function ChallengesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { challenges, profile } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  const filtered = activeFilter === "All"
    ? challenges
    : challenges.filter((c) => c.difficulty === activeFilter);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.filter((c) => c.completed).reduce((s, c) => s + c.xpReward, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Practice</Text>
        <Text style={[styles.screenSub, { color: colors.textMuted }]}>
          {completedCount}/{challenges.length} solved
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { icon: "check-circle", value: `${completedCount}/${challenges.length}`, label: "Solved", color: colors.accentGreen },
          { icon: "award", value: `${totalXP}`, label: "XP earned", color: "#CA8A04" },
          { icon: "trending-up", value: `${profile.level}`, label: "Level", color: colors.text },
        ].map((s) => (
          <View key={s.label} style={[styles.statCard, { borderColor: colors.cardBorder, backgroundColor: colors.backgroundSecondary }]}>
            <Feather name={s.icon as any} size={16} color={s.color} />
            <Text style={[styles.statNum, { color: colors.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersScroll}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilter === f ? colors.text : "transparent",
                borderColor: activeFilter === f ? colors.text : colors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.filterText, { color: activeFilter === f ? colors.background : colors.textSecondary }]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Challenge List */}
      <View style={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="code" size={32} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No challenges</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Try a different filter</Text>
          </View>
        ) : (
          filtered.map((ch, i, arr) => {
            const isLast = i === arr.length - 1;
            const diffColor = DIFF_COLORS[ch.difficulty];
            return (
              <Pressable
                key={ch.id}
                onPress={() => router.push(`/challenge/${ch.id}`)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <View style={styles.challengeRow}>
                  <View style={[styles.challengeIcon, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
                    {ch.completed
                      ? <Feather name="check" size={14} color={colors.accentGreen} />
                      : <Feather name="code" size={14} color={colors.textMuted} />
                    }
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={[styles.challengeTitle, { color: ch.completed ? colors.textMuted : colors.text }]}>{ch.title}</Text>
                    <View style={styles.challengeMeta}>
                      <Text style={[styles.challengeDiff, { color: diffColor }]}>{ch.difficulty}</Text>
                      <Text style={[styles.challengeLang, { color: colors.textMuted }]}>{ch.language}</Text>
                      <Text style={[styles.challengeXP, { color: colors.textMuted }]}>+{ch.xpReward} XP</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={15} color={colors.textMuted} />
                </View>
                {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator, marginLeft: 56 }]} />}
              </Pressable>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  screenTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  screenSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 16 },
  statsRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 10, borderWidth: 1, padding: 12, alignItems: "center", gap: 4 },
  statNum: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  filtersScroll: { marginBottom: 8 },
  filters: { paddingHorizontal: 20, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  list: { paddingHorizontal: 20, marginTop: 8 },
  emptyState: { alignItems: "center", paddingTop: 48, gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  challengeRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13 },
  challengeIcon: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  challengeMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  challengeDiff: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  challengeLang: { fontSize: 11, fontFamily: "Inter_500Medium" },
  challengeXP: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rowDivider: { height: 1 },
});
