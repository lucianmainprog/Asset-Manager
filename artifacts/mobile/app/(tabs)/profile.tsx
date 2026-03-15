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
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp, ACHIEVEMENTS } from "@/context/AppContext";
import { XPBar } from "@/components/XPBar";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, courses, challenges, xpProgress, xpToNextLevel, updateName } = useApp();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 10;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 80;

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

  const levelTitle = profile.level <= 3 ? "Novice" : profile.level <= 7 ? "Developer" : profile.level <= 12 ? "Engineer" : "Expert";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: isDark ? "#1E3A8A" : "#1E3A8A" }]}>
          <Text style={styles.avatarText}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              style={[
                styles.nameInput,
                { color: colors.text, borderColor: colors.accent, backgroundColor: colors.card },
              ]}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
            <Pressable onPress={handleSaveName}>
              <Feather name="check" size={22} color={colors.accent} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.nameRow} onPress={() => setEditing(true)}>
            <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
            <Feather name="edit-2" size={14} color={colors.textMuted} />
          </Pressable>
        )}
        <Text style={[styles.levelTitle, { color: colors.accent }]}>
          Level {profile.level} · {levelTitle}
        </Text>
      </View>

      <View style={styles.section}>
        <XPBar
          xp={profile.xp}
          level={profile.level}
          xpToNext={xpToNextLevel}
          progress={xpProgress}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Stats</Text>
        <View style={styles.statsGrid}>
          {[
            { icon: "book-open", value: profile.completedLessons.length, label: "Lessons Done", color: colors.accent },
            { icon: "zap", value: profile.xp, label: "Total XP", color: "#FF6B35" },
            { icon: "check-square", value: profile.completedChallenges.length, label: "Challenges", color: "#10B981" },
            { icon: "layers", value: inProgressCourses.length, label: "In Progress", color: "#F59E0B" },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Feather name={stat.icon as any} size={20} color={stat.color} />
              <Text style={[styles.statNum, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
        <View style={styles.achievementsList}>
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = achievementUnlocked(ach.id);
            return (
              <View
                key={ach.id}
                style={[
                  styles.achCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: unlocked
                      ? isDark ? "#00D4FF33" : "#1E3A8A33"
                      : colors.cardBorder,
                    opacity: unlocked ? 1 : 0.5,
                  },
                ]}
              >
                <View
                  style={[
                    styles.achIcon,
                    { backgroundColor: unlocked ? (isDark ? "#00D4FF22" : "#1E3A8A22") : colors.backgroundTertiary },
                  ]}
                >
                  <Feather
                    name={ach.icon as any}
                    size={18}
                    color={unlocked ? colors.accent : colors.textMuted}
                  />
                </View>
                <View style={styles.achInfo}>
                  <Text style={[styles.achTitle, { color: colors.text }]}>{ach.title}</Text>
                  <Text style={[styles.achDesc, { color: colors.textSecondary }]}>{ach.description}</Text>
                </View>
                {unlocked ? (
                  <Feather name="check-circle" size={18} color={colors.accent} />
                ) : (
                  <View style={[styles.xpPill, { backgroundColor: colors.backgroundTertiary }]}>
                    <Text style={[styles.xpPillText, { color: colors.textMuted }]}>+{ach.xpReward}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  profileName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nameInput: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 160,
  },
  levelTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },
  statNum: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  achievementsList: {
    gap: 8,
  },
  achCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  achIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  achInfo: {
    flex: 1,
    gap: 2,
  },
  achTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  achDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  xpPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  xpPillText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
});
