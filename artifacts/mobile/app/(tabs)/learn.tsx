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
import { CourseCard } from "@/components/CourseCard";

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { courses } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 10;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 80;

  const filtered = activeFilter === "All"
    ? courses
    : courses.filter((c) => c.difficulty === activeFilter);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Learn</Text>
        <Text style={[styles.screenSub, { color: colors.textSecondary }]}>
          {courses.length} courses available
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={[styles.statPill, { backgroundColor: isDark ? "#1E3A8A22" : "#EFF6FF", borderColor: isDark ? "#1E3A8A55" : "#BFDBFE" }]}>
          <Feather name="book-open" size={14} color={colors.accent} />
          <Text style={[styles.statPillText, { color: colors.accent }]}>
            {courses.filter((c) => c.completedLessons > 0).length} in progress
          </Text>
        </View>
        <View style={[styles.statPill, { backgroundColor: isDark ? "#10B98122" : "#ECFDF5", borderColor: isDark ? "#10B98144" : "#A7F3D0" }]}>
          <Feather name="check-circle" size={14} color="#10B981" />
          <Text style={[styles.statPillText, { color: "#10B981" }]}>
            {courses.filter((c) => c.completedLessons === c.totalLessons && c.totalLessons > 0).length} completed
          </Text>
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
                backgroundColor:
                  activeFilter === f ? colors.accent : colors.card,
                borderColor:
                  activeFilter === f ? colors.accent : colors.cardBorder,
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

      <View style={styles.coursesList}>
        {filtered.map((course) => (
          <Pressable
            key={course.id}
            onPress={() => router.push(`/lesson/${course.id}`)}
            style={({ pressed }) => [styles.fullCardWrapper, { opacity: pressed ? 0.9 : 1 }]}
          >
            <View
              style={[
                styles.fullCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <View style={[styles.langIcon, { backgroundColor: course.color + "22" }]}>
                <Feather name={course.icon as any} size={26} color={course.color} />
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                  <View
                    style={[
                      styles.diffBadge,
                      {
                        backgroundColor:
                          course.difficulty === "Beginner"
                            ? "#10B98122"
                            : course.difficulty === "Intermediate"
                            ? "#F59E0B22"
                            : "#EF444422",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diffText,
                        {
                          color:
                            course.difficulty === "Beginner"
                              ? "#10B981"
                              : course.difficulty === "Intermediate"
                              ? "#F59E0B"
                              : "#EF4444",
                        },
                      ]}
                    >
                      {course.difficulty}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.courseDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                  {course.description}
                </Text>
                <View style={styles.cardFooter}>
                  <View style={[styles.progressBar, { backgroundColor: colors.backgroundTertiary }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(course.completedLessons / course.totalLessons) * 100}%`,
                          backgroundColor: course.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.lessonCount, { color: colors.textMuted }]}>
                    {course.completedLessons}/{course.totalLessons}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </View>
          </Pressable>
        ))}
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
  stats: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statPillText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
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
  coursesList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  fullCardWrapper: {},
  fullCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  langIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  courseDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  lessonCount: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    width: 32,
    textAlign: "right",
  },
});
