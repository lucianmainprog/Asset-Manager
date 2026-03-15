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

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { courses } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

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
        <Text style={[styles.screenTitle, { color: colors.text }]}>Courses</Text>
        <Text style={[styles.screenSub, { color: colors.textMuted }]}>{courses.length} available</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

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

      <View style={styles.list}>
        {filtered.map((course, index) => {
          const progress = course.totalLessons > 0 ? course.completedLessons / course.totalLessons : 0;
          const isLast = index === filtered.length - 1;
          return (
            <Pressable
              key={course.id}
              onPress={() => router.push(`/lesson/${course.id}`)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <View style={styles.courseRow}>
                <View style={[styles.langDot, { backgroundColor: course.color }]} />
                <View style={styles.courseInfo}>
                  <View style={styles.courseTopRow}>
                    <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                    <Text style={[styles.diffBadge, {
                      color: course.difficulty === "Beginner" ? colors.accentGreen :
                             course.difficulty === "Intermediate" ? "#D97706" : colors.danger
                    }]}>
                      {course.difficulty}
                    </Text>
                  </View>
                  <Text style={[styles.courseDesc, { color: colors.textMuted }]} numberOfLines={1}>
                    {course.description}
                  </Text>
                  <View style={styles.courseFooter}>
                    <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
                      <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: course.color }]} />
                    </View>
                    <Text style={[styles.lessonCount, { color: colors.textMuted }]}>
                      {course.completedLessons}/{course.totalLessons}
                    </Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textMuted} />
              </View>
              {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />}
            </Pressable>
          );
        })}
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
  filtersScroll: { marginBottom: 8 },
  filters: { paddingHorizontal: 20, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  list: { paddingHorizontal: 20, marginTop: 8 },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  langDot: { width: 10, height: 10, borderRadius: 5 },
  courseInfo: { flex: 1, gap: 4 },
  courseTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  courseTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  diffBadge: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  courseDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  courseFooter: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  progressTrack: { flex: 1, height: 2, borderRadius: 1, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 1 },
  lessonCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rowDivider: { height: 1, marginLeft: 24 },
});
