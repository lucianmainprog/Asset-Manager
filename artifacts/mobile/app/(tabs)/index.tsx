import React, { useRef } from "react";
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
import { XPBar } from "@/components/XPBar";
import { CourseCard } from "@/components/CourseCard";
import { StreakDisplay } from "@/components/StreakDisplay";

const DAILY_CHALLENGE = {
  id: "ch3",
  title: "Find Prime Numbers",
  difficulty: "Intermediate",
  xpReward: 100,
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, courses, xpProgress, xpToNextLevel, activeCourses } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 10;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 80;

  const inProgressCourses = courses.filter((c) => c.completedLessons > 0);
  const recommendedCourses = courses.filter((c) => c.completedLessons === 0).slice(0, 4);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back</Text>
          <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
        </View>
        <StreakDisplay streak={profile.streak} />
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <XPBar
          xp={profile.xp}
          level={profile.level}
          xpToNext={xpToNextLevel}
          progress={xpProgress}
        />
      </View>

      {inProgressCourses.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
          <View style={styles.continueList}>
            {inProgressCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="compact"
                onPress={() => router.push(`/lesson/${course.id}`)}
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Challenge</Text>
          <View style={[styles.dailyBadge, { backgroundColor: "#FF6B3522" }]}>
            <Feather name="zap" size={11} color="#FF6B35" />
            <Text style={[styles.dailyBadgeText, { color: "#FF6B35" }]}>+{DAILY_CHALLENGE.xpReward} XP</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push(`/challenge/${DAILY_CHALLENGE.id}`)}
          style={({ pressed }) => [
            styles.dailyCard,
            {
              backgroundColor: isDark ? "#0F2140" : "#1E3A8A",
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.dailyCardContent}>
            <View style={styles.dailyIcon}>
              <Feather name="code" size={24} color="#00D4FF" />
            </View>
            <View style={styles.dailyInfo}>
              <Text style={styles.dailyTitle}>{DAILY_CHALLENGE.title}</Text>
              <Text style={styles.dailySub}>{DAILY_CHALLENGE.difficulty} · JavaScript</Text>
            </View>
            <Feather name="arrow-right" size={20} color="rgba(255,255,255,0.7)" />
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended</Text>
          <Pressable onPress={() => router.push("/(tabs)/learn")}>
            <Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {recommendedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => router.push(`/lesson/${course.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Feather name="book-open" size={20} color={colors.accent} />
            <Text style={[styles.statNum, { color: colors.text }]}>{profile.completedLessons.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Lessons</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Feather name="zap" size={20} color="#FF6B35" />
            <Text style={[styles.statNum, { color: colors.text }]}>{profile.xp}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP Earned</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Feather name="award" size={20} color="#F59E0B" />
            <Text style={[styles.statNum, { color: colors.text }]}>{profile.level}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Level</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Feather name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.statNum, { color: colors.text }]}>{profile.completedChallenges.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Challenges</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  name: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  continueList: {
    gap: 8,
  },
  dailyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dailyBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  dailyCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  dailyCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  dailyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(0, 212, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  dailyInfo: {
    flex: 1,
  },
  dailyTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  dailySub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 2,
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
  },
  horizontalScroll: {
    paddingRight: 20,
    gap: 12,
  },
});
