import React from "react";
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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, courses, xpProgress, xpToNextLevel } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  const inProgressCourses = courses.filter((c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons);
  const dailyChallengeId = "ch3";

  const xpPercent = Math.min(Math.round(xpProgress * 100), 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>Good day,</Text>
          <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
        </View>
        <View style={[styles.streakPill, { borderColor: colors.cardBorder }]}>
          <Feather name="zap" size={14} color="#EA580C" />
          <Text style={[styles.streakNum, { color: colors.text }]}>{profile.streak}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.xpRow}>
        <Text style={[styles.xpLabel, { color: colors.textMuted }]}>Level {profile.level}</Text>
        <Text style={[styles.xpLabel, { color: colors.textMuted }]}>{profile.xp} / {xpToNextLevel} XP</Text>
      </View>
      <View style={[styles.xpTrack, { backgroundColor: colors.backgroundTertiary }]}>
        <View style={[styles.xpFill, { width: `${xpPercent}%`, backgroundColor: colors.text }]} />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator, marginTop: 24 }]} />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>DAILY CHALLENGE</Text>
        <Pressable
          onPress={() => router.push(`/challenge/${dailyChallengeId}`)}
          style={({ pressed }) => [
            styles.challengeRow,
            { borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={[styles.challengeIcon, { backgroundColor: colors.backgroundSecondary }]}>
            <Feather name="code" size={18} color={colors.text} />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={[styles.challengeTitle, { color: colors.text }]}>Find Prime Numbers</Text>
            <Text style={[styles.challengeSub, { color: colors.textMuted }]}>Intermediate · +100 XP</Text>
          </View>
          <Feather name="arrow-right" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {inProgressCourses.length > 0 && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CONTINUE LEARNING</Text>
            {inProgressCourses.slice(0, 3).map((course) => {
              const progress = course.completedLessons / course.totalLessons;
              return (
                <Pressable
                  key={course.id}
                  onPress={() => router.push(`/lesson/${course.id}`)}
                  style={({ pressed }) => [
                    styles.courseRow,
                    { borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <View style={[styles.courseDot, { backgroundColor: course.color }]} />
                  <View style={styles.courseRowInfo}>
                    <Text style={[styles.courseRowTitle, { color: colors.text }]}>{course.title}</Text>
                    <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
                      <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: course.color }]} />
                    </View>
                  </View>
                  <Text style={[styles.courseRowCount, { color: colors.textMuted }]}>
                    {course.completedLessons}/{course.totalLessons}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        </>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>YOUR PROGRESS</Text>
        <View style={styles.statsGrid}>
          {[
            { value: profile.completedLessons.length, label: "Lessons done" },
            { value: profile.completedChallenges.length, label: "Challenges" },
            { value: courses.filter((c) => c.completedLessons > 0).length, label: "Courses started" },
            { value: profile.level, label: "Level" },
          ].map((s) => (
            <View key={s.label} style={[styles.statItem, { borderColor: colors.cardBorder }]}>
              <Text style={[styles.statNum, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>START A COURSE</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/learn")}
          style={({ pressed }) => [
            styles.startBtn,
            { borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="book-open" size={16} color={colors.text} />
          <Text style={[styles.startBtnText, { color: colors.text }]}>Browse all courses</Text>
          <Feather name="arrow-right" size={16} color={colors.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 2 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 20 },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  xpLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  xpTrack: {
    height: 3,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: "hidden",
  },
  xpFill: { height: "100%", borderRadius: 2 },
  section: { paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  challengeIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  challengeSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  courseDot: { width: 8, height: 8, borderRadius: 4 },
  courseRowInfo: { flex: 1, gap: 6 },
  courseRowTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  progressTrack: { height: 2, borderRadius: 1, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 1 },
  courseRowCount: { fontSize: 12, fontFamily: "Inter_500Medium" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statItem: {
    flex: 1,
    minWidth: "45%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  statNum: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  startBtnText: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
