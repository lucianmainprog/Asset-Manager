import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import type { Course } from "@/context/AppContext";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  variant?: "full" | "compact";
}

const DIFFICULTY_COLORS = {
  Beginner: "#10B981",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

export function CourseCard({ course, onPress, variant = "full" }: CourseCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const progress = course.totalLessons > 0 ? course.completedLessons / course.totalLessons : 0;

  if (variant === "compact") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.compactCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.iconCircleSmall, { backgroundColor: course.color + "22" }]}>
          <Feather name={course.icon as any} size={18} color={course.color} />
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactTitle, { color: colors.text }]}>{course.title}</Text>
          <Text style={[styles.compactSub, { color: colors.textSecondary }]}>
            {course.completedLessons}/{course.totalLessons} lessons
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%`, backgroundColor: course.color },
              ]}
            />
          </View>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.iconCircle, { backgroundColor: course.color + "22" }]}>
          <Feather name={course.icon as any} size={28} color={course.color} />
        </View>
        <View style={styles.badges}>
          <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[course.difficulty] + "22" }]}>
            <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[course.difficulty] }]}>
              {course.difficulty}
            </Text>
          </View>
          <View style={[styles.xpBadge, { backgroundColor: colors.backgroundTertiary }]}>
            <Feather name="zap" size={10} color={colors.accent} />
            <Text style={[styles.xpBadgeText, { color: colors.accent }]}>+{course.xpReward} XP</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {course.description}
      </Text>
      <View style={styles.footer}>
        <View style={styles.lessonsRow}>
          <Feather name="book-open" size={12} color={colors.textMuted} />
          <Text style={[styles.lessonsText, { color: colors.textMuted }]}>
            {course.completedLessons}/{course.totalLessons} lessons
          </Text>
        </View>
        <View style={[styles.progressTrackFull, { backgroundColor: colors.backgroundTertiary }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%`, backgroundColor: course.color },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    width: 200,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badges: {
    gap: 4,
    alignItems: "flex-end",
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  diffText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  xpBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  footer: {
    gap: 6,
  },
  lessonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lessonsText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  progressTrackFull: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  iconCircleSmall: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  compactInfo: {
    flex: 1,
    gap: 4,
  },
  compactTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  compactSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 2,
  },
});
