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
import { useSubscription } from "@/context/SubscriptionContext";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, courses, xpProgress, xpToNextLevel, challenges } = useApp();
  const { isPremium } = useSubscription();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  const inProgressCourses = courses.filter((c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons);
  const dailyChallenge = challenges.find((c) => c.id === "ch3") ?? challenges[0];

  const xpPercent = Math.min(Math.round(xpProgress * 100), 100);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const levelTitle =
    profile.level <= 3 ? "Novice" :
    profile.level <= 7 ? "Developer" :
    profile.level <= 12 ? "Engineer" : "Expert";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>{greeting()},</Text>
          <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          style={({ pressed }) => [styles.streakPill, { borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="zap" size={13} color="#EA580C" />
          <Text style={[styles.streakNum, { color: colors.text }]}>{profile.streak}</Text>
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* XP Bar */}
      <View style={styles.xpBlock}>
        <View style={styles.xpRow}>
          <View style={styles.xpLeft}>
            <Text style={[styles.levelLabel, { color: colors.text }]}>Level {profile.level}</Text>
            <Text style={[styles.levelTitle, { color: colors.textMuted }]}>{levelTitle}</Text>
          </View>
          <Text style={[styles.xpCount, { color: colors.textMuted }]}>{profile.xp} / {xpToNextLevel} XP</Text>
        </View>
        <View style={[styles.xpTrack, { backgroundColor: colors.backgroundTertiary }]}>
          <View style={[styles.xpFill, { width: `${xpPercent}%`, backgroundColor: colors.text }]} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Premium Banner for free users */}
      {!isPremium && (
        <View style={styles.section}>
          <Pressable
            onPress={() => router.push("/premium")}
            style={({ pressed }) => [styles.premiumBanner, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder, opacity: pressed ? 0.8 : 1 }]}
          >
            <View style={styles.premiumBannerLeft}>
              <View style={[styles.premiumIconBox, { backgroundColor: "#CA8A0415" }]}>
                <Feather name="star" size={18} color="#CA8A04" />
              </View>
              <View>
                <Text style={[styles.premiumBannerTitle, { color: colors.text }]}>Unlock Premium</Text>
                <Text style={[styles.premiumBannerSub, { color: colors.textMuted }]}>Cloud · DevOps · ML · CCNA · Sec+ · $9.99/mo</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </Pressable>
        </View>
      )}

      {/* Daily Challenge */}
      {dailyChallenge && (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>DAILY CHALLENGE</Text>
          <Pressable
            onPress={() => router.push(`/challenge/${dailyChallenge.id}`)}
            style={({ pressed }) => [styles.challengeCard, { borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.challengeIcon, { backgroundColor: colors.backgroundSecondary }]}>
              <Feather name="code" size={18} color={colors.text} />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={[styles.challengeTitle, { color: colors.text }]}>{dailyChallenge.title}</Text>
              <Text style={[styles.challengeSub, { color: colors.textMuted }]}>
                {dailyChallenge.difficulty} · +{dailyChallenge.xpReward} XP
              </Text>
            </View>
            {dailyChallenge.completed
              ? <Feather name="check-circle" size={18} color={colors.accentGreen} />
              : <Feather name="arrow-right" size={18} color={colors.textMuted} />
            }
          </Pressable>
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CONTINUE LEARNING</Text>
            <View style={styles.courseList}>
              {inProgressCourses.slice(0, 3).map((course, i, arr) => {
                const progress = course.completedLessons / course.totalLessons;
                const isLast = i === arr.slice(0, 3).length - 1;
                return (
                  <View key={course.id}>
                    <Pressable
                      onPress={() => router.push(`/lesson/${course.id}`)}
                      style={({ pressed }) => [styles.courseRow, { opacity: pressed ? 0.7 : 1 }]}
                    >
                      <View style={[styles.courseIcon, { backgroundColor: course.color + "18" }]}>
                        <Feather name={course.icon as any} size={16} color={course.color} />
                      </View>
                      <View style={styles.courseRowInfo}>
                        <Text style={[styles.courseRowTitle, { color: colors.text }]}>{course.title}</Text>
                        <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
                          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: course.color }]} />
                        </View>
                      </View>
                      <Text style={[styles.courseRowCount, { color: colors.textMuted }]}>
                        {Math.round(progress * 100)}%
                      </Text>
                    </Pressable>
                    {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator, marginLeft: 48 }]} />}
                  </View>
                );
              })}
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        </>
      )}

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>YOUR PROGRESS</Text>
        <View style={styles.statsGrid}>
          {[
            { value: profile.completedLessons.length, label: "Lessons done", icon: "book-open" },
            { value: profile.completedChallenges.length, label: "Challenges", icon: "code" },
            { value: courses.filter((c) => c.completedLessons > 0).length, label: "Courses started", icon: "layers" },
            { value: profile.level, label: "Level", icon: "trending-up" },
          ].map((s) => (
            <View key={s.label} style={[styles.statItem, { borderColor: colors.cardBorder }]}>
              <Feather name={s.icon as any} size={14} color={colors.textMuted} style={{ marginBottom: 4 }} />
              <Text style={[styles.statNum, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Browse all */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>START A COURSE</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/learn")}
          style={({ pressed }) => [styles.browseBtn, { borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="book-open" size={16} color={colors.text} />
          <Text style={[styles.browseBtnText, { color: colors.text }]}>Browse all {courses.length} courses</Text>
          <Feather name="arrow-right" size={16} color={colors.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 2 },
  streakPill: { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  streakNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 20 },
  xpBlock: { paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  xpRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  xpLeft: { gap: 1 },
  levelLabel: { fontSize: 15, fontFamily: "Inter_700Bold" },
  levelTitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
  xpCount: { fontSize: 12, fontFamily: "Inter_500Medium" },
  xpTrack: { height: 3, borderRadius: 2, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 2 },
  section: { paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  premiumBanner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 14, borderWidth: 1 },
  premiumBannerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  premiumIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  premiumBannerTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  premiumBannerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  challengeCard: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderRadius: 12, padding: 14 },
  challengeIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  challengeSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  courseList: { gap: 0 },
  courseRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  courseIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  courseRowInfo: { flex: 1, gap: 6 },
  courseRowTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  progressTrack: { height: 2, borderRadius: 1, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 1 },
  courseRowCount: { fontSize: 12, fontFamily: "Inter_500Medium" },
  rowDivider: { height: 1 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statItem: { flex: 1, minWidth: "45%", borderWidth: 1, borderRadius: 10, padding: 14 },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  browseBtn: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 10, padding: 14 },
  browseBtnText: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
