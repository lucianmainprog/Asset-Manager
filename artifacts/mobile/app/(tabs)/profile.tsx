import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  useColorScheme,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp, ACHIEVEMENTS } from "@/context/AppContext";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, courses, xpProgress, xpToNextLevel, updateName } = useApp();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  const completedCourses = courses.filter((c) => c.completedLessons === c.totalLessons && c.totalLessons > 0);
  const inProgressCourses = courses.filter((c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons);

  const handleSaveName = async () => {
    await updateName(nameInput.trim() || "Learner");
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const achievementUnlocked = (id: string) => {
    if (id === "first_lesson") return profile.completedLessons.length >= 1;
    if (id === "streak_7") return profile.streak >= 7;
    if (id === "xp_500") return profile.xp >= 500;
    if (id === "first_challenge") return profile.completedChallenges.length >= 1;
    if (id === "courses_3") return inProgressCourses.length + completedCourses.length >= 3;
    if (id === "xp_1000") return profile.xp >= 1000;
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
      <View style={styles.topSection}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameSection}>
            {editing ? (
              <View style={styles.editRow}>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  style={[styles.nameInput, { color: colors.text, borderColor: colors.cardBorder }]}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                />
                <Pressable onPress={handleSaveName}>
                  <Feather name="check" size={20} color={colors.text} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.nameRow} onPress={() => setEditing(true)}>
                <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
                <Feather name="edit-2" size={13} color={colors.textMuted} />
              </Pressable>
            )}
            <Text style={[styles.levelTitle, { color: colors.textMuted }]}>
              Level {profile.level} · {levelTitle}
            </Text>
          </View>
        </View>

        <View style={styles.xpSection}>
          <View style={styles.xpLabelRow}>
            <Text style={[styles.xpLabel, { color: colors.textMuted }]}>XP Progress</Text>
            <Text style={[styles.xpLabel, { color: colors.textMuted }]}>{profile.xp} / {xpToNextLevel}</Text>
          </View>
          <View style={[styles.xpTrack, { backgroundColor: colors.backgroundTertiary }]}>
            <View style={[styles.xpFill, { width: `${xpPercent}%`, backgroundColor: colors.text }]} />
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PROGRESS</Text>
        <View style={styles.statsGrid}>
          {[
            { value: profile.completedLessons.length, label: "Lessons" },
            { value: profile.xp, label: "Total XP" },
            { value: profile.completedChallenges.length, label: "Challenges" },
            { value: profile.streak, label: "Day streak" },
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
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACHIEVEMENTS</Text>
        <View style={styles.achievementsList}>
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = achievementUnlocked(ach.id);
            return (
              <View key={ach.id} style={[styles.achRow, { opacity: unlocked ? 1 : 0.4 }]}>
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
                  ? <Feather name="check-circle" size={16} color={colors.text} />
                  : <Text style={[styles.xpPillText, { color: colors.textMuted }]}>+{ach.xpReward} XP</Text>
                }
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>COURSES IN PROGRESS</Text>
        {inProgressCourses.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No courses started yet.</Text>
        )}
        {inProgressCourses.map((course, index) => {
          const progress = course.completedLessons / course.totalLessons;
          const isLast = index === inProgressCourses.length - 1;
          return (
            <View key={course.id}>
              <View style={styles.courseProgressRow}>
                <View style={[styles.courseDot, { backgroundColor: course.color }]} />
                <Text style={[styles.courseProgressTitle, { color: colors.text }]}>{course.title}</Text>
                <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: course.color }]} />
                </View>
                <Text style={[styles.progressCount, { color: colors.textMuted }]}>{course.completedLessons}/{course.totalLessons}</Text>
              </View>
              {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator, marginLeft: 24 }]} />}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { paddingHorizontal: 20, paddingBottom: 20, gap: 16 },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 4 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontFamily: "Inter_700Bold" },
  nameSection: { flex: 1, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  profileName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  editRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  nameInput: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flex: 1,
  },
  levelTitle: { fontSize: 13, fontFamily: "Inter_500Medium" },
  xpSection: { gap: 6 },
  xpLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  xpTrack: { height: 3, borderRadius: 2, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 2 },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 20 },
  section: { paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
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
  achievementsList: { gap: 4 },
  achRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  achIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  achInfo: { flex: 1 },
  achTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  achDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  xpPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  courseProgressRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  courseDot: { width: 8, height: 8, borderRadius: 4 },
  courseProgressTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", width: 80 },
  progressTrack: { flex: 1, height: 2, borderRadius: 1, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 1 },
  progressCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rowDivider: { height: 1 },
});
