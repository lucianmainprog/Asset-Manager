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
import { useApp, ACHIEVEMENTS } from "@/context/AppContext";
import { useSubscription } from "@/context/SubscriptionContext";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, courses, xpProgress, xpToNextLevel } = useApp();
  const { isPremium } = useSubscription();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  const completedCourses = courses.filter((c) => c.completedLessons === c.totalLessons && c.totalLessons > 0);
  const inProgressCourses = courses.filter((c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons);

  const achievementUnlocked = (id: string) => {
    if (id === "first_lesson") return profile.completedLessons.length >= 1;
    if (id === "streak_7") return profile.streak >= 7;
    if (id === "xp_500") return profile.xp >= 500;
    if (id === "first_challenge") return profile.completedChallenges.length >= 1;
    if (id === "courses_3") return inProgressCourses.length + completedCourses.length >= 3;
    if (id === "xp_1000") return profile.xp >= 1000;
    if (id === "net_complete") return courses.find((c) => c.id === "networking")?.completedLessons === courses.find((c) => c.id === "networking")?.totalLessons;
    if (id === "sec_complete") return courses.find((c) => c.id === "cybersecurity")?.completedLessons === courses.find((c) => c.id === "cybersecurity")?.totalLessons;
    return false;
  };

  const levelTitle =
    profile.level <= 3 ? "Novice" :
    profile.level <= 7 ? "Developer" :
    profile.level <= 12 ? "Engineer" : "Expert";

  const xpPercent = Math.min(Math.round(xpProgress * 100), 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Profile</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          style={({ pressed }) => [styles.settingsBtn, { borderColor: colors.cardBorder, opacity: pressed ? 0.6 : 1 }]}
        >
          <Feather name="settings" size={18} color={colors.text} />
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Avatar + Name */}
      <View style={styles.topSection}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameSection}>
            <View style={styles.nameAndBadge}>
              <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
              {isPremium && (
                <View style={[styles.premiumBadge, { backgroundColor: "#CA8A0411", borderColor: "#CA8A04" }]}>
                  <Feather name="star" size={10} color="#CA8A04" />
                  <Text style={[styles.premiumBadgeText, { color: "#CA8A04" }]}>Premium</Text>
                </View>
              )}
            </View>
            <Text style={[styles.levelTitle, { color: colors.textMuted }]}>
              Level {profile.level} · {levelTitle}
            </Text>
          </View>
        </View>

        <View style={styles.xpSection}>
          <View style={styles.xpLabelRow}>
            <Text style={[styles.xpLabel, { color: colors.textMuted }]}>XP Progress</Text>
            <Text style={[styles.xpLabel, { color: colors.textMuted }]}>{profile.xp} / {xpToNextLevel} XP</Text>
          </View>
          <View style={[styles.xpTrack, { backgroundColor: colors.backgroundTertiary }]}>
            <View style={[styles.xpFill, { width: `${xpPercent}%`, backgroundColor: colors.text }]} />
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PROGRESS</Text>
        <View style={styles.statsGrid}>
          {[
            { value: profile.completedLessons.length, label: "Lessons" },
            { value: profile.xp, label: "Total XP" },
            { value: profile.completedChallenges.length, label: "Challenges" },
            { value: `${profile.streak}d`, label: "Streak" },
          ].map((s) => (
            <View key={s.label} style={[styles.statItem, { borderColor: colors.cardBorder }]}>
              <Text style={[styles.statNum, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Premium Upsell (free users only) */}
      {!isPremium && (
        <>
          <View style={styles.section}>
            <Pressable
              onPress={() => router.push("/premium")}
              style={({ pressed }) => [styles.premiumCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder, opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={styles.premiumCardLeft}>
                <Feather name="star" size={20} color="#CA8A04" />
                <View>
                  <Text style={[styles.premiumCardTitle, { color: colors.text }]}>Upgrade to Premium</Text>
                  <Text style={[styles.premiumCardSub, { color: colors.textMuted }]}>Cloud, DevOps, ML, CCNA, Sec+ · $9.99/mo</Text>
                </View>
              </View>
              <Feather name="arrow-right" size={16} color={colors.textMuted} />
            </Pressable>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        </>
      )}

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACHIEVEMENTS</Text>
        <View style={styles.achievementsList}>
          {ACHIEVEMENTS.map((ach, i) => {
            const unlocked = achievementUnlocked(ach.id);
            const isLast = i === ACHIEVEMENTS.length - 1;
            return (
              <View key={ach.id}>
                <View style={[styles.achRow, { opacity: unlocked ? 1 : 0.4 }]}>
                  <View style={[styles.achIcon, {
                    backgroundColor: unlocked ? colors.backgroundSecondary : colors.backgroundTertiary,
                    borderColor: unlocked ? colors.cardBorder : "transparent",
                  }]}>
                    <Feather name={ach.icon as any} size={16} color={unlocked ? colors.text : colors.textMuted} />
                  </View>
                  <View style={styles.achInfo}>
                    <Text style={[styles.achTitle, { color: colors.text }]}>{ach.title}</Text>
                    <Text style={[styles.achDesc, { color: colors.textMuted }]}>{ach.description}</Text>
                  </View>
                  {unlocked
                    ? <Feather name="check-circle" size={16} color={colors.accentGreen} />
                    : <Text style={[styles.xpPillText, { color: colors.textMuted }]}>+{ach.xpReward} XP</Text>
                  }
                </View>
                {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator, marginLeft: 48 }]} />}
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Courses in progress */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>COURSES IN PROGRESS</Text>
        {inProgressCourses.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Start a course in the Learn tab.</Text>
        )}
        {inProgressCourses.map((course, index) => {
          const progress = course.completedLessons / course.totalLessons;
          const isLast = index === inProgressCourses.length - 1;
          return (
            <Pressable
              key={course.id}
              onPress={() => router.push(`/lesson/${course.id}`)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <View style={styles.courseProgressRow}>
                <View style={[styles.courseDot, { backgroundColor: course.color }]} />
                <Text style={[styles.courseProgressTitle, { color: colors.text }]} numberOfLines={1}>{course.title}</Text>
                <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: course.color }]} />
                </View>
                <Text style={[styles.progressCount, { color: colors.textMuted }]}>{course.completedLessons}/{course.totalLessons}</Text>
              </View>
              {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator, marginLeft: 24 }]} />}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 },
  screenTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  settingsBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 20 },
  topSection: { paddingHorizontal: 20, paddingBottom: 20, gap: 16 },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 26, fontFamily: "Inter_700Bold" },
  nameSection: { flex: 1, gap: 4 },
  nameAndBadge: { flexDirection: "row", alignItems: "center", gap: 8 },
  profileName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  premiumBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  premiumBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  levelTitle: { fontSize: 13, fontFamily: "Inter_500Medium" },
  xpSection: { gap: 6 },
  xpLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  xpTrack: { height: 3, borderRadius: 2, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 2 },
  section: { paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statItem: { flex: 1, minWidth: "45%", borderWidth: 1, borderRadius: 10, padding: 14, gap: 4 },
  statNum: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  premiumCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 14, borderWidth: 1 },
  premiumCardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  premiumCardTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  premiumCardSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  achievementsList: { gap: 0 },
  achRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  achIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  achInfo: { flex: 1 },
  achTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  achDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  xpPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  courseProgressRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  courseDot: { width: 8, height: 8, borderRadius: 4 },
  courseProgressTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", width: 90 },
  progressTrack: { flex: 1, height: 2, borderRadius: 1, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 1 },
  progressCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rowDivider: { height: 1 },
});
