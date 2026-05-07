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
import { useSubscription } from "@/context/SubscriptionContext";

const CATEGORY_FILTERS = ["All", "Free", "Premium"];

const CATEGORY_LABELS: Record<string, string> = {
  programming: "Programming",
  certification: "Certifications",
  cloud: "Cloud & DevOps",
  ml: "AI & ML",
};

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { courses } = useApp();
  const { isPremium } = useSubscription();
  const [activeFilter, setActiveFilter] = useState("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  const freeCourses = courses.filter((c) => !c.isPremium);
  const premiumCourses = courses.filter((c) => c.isPremium);

  const filteredCourses = activeFilter === "All"
    ? courses
    : activeFilter === "Free"
    ? freeCourses
    : premiumCourses;

  const handleCoursePress = (courseId: string, isPremiumCourse: boolean) => {
    if (isPremiumCourse && !isPremium) {
      router.push("/premium");
    } else {
      router.push(`/lesson/${courseId}`);
    }
  };

  const renderCourseRow = (course: typeof courses[0], index: number, arr: typeof courses) => {
    const progress = course.totalLessons > 0 ? course.completedLessons / course.totalLessons : 0;
    const isLocked = course.isPremium && !isPremium;
    const isLast = index === arr.length - 1;

    const diffColor =
      course.difficulty === "Beginner" ? colors.accentGreen :
      course.difficulty === "Intermediate" ? "#D97706" : colors.danger;

    return (
      <Pressable
        key={course.id}
        onPress={() => handleCoursePress(course.id, course.isPremium ?? false)}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      >
        <View style={[styles.courseRow, { opacity: isLocked ? 0.7 : 1 }]}>
          <View style={[styles.courseIconBox, { backgroundColor: course.color + "18" }]}>
            <Feather name={course.icon as any} size={18} color={course.color} />
          </View>
          <View style={styles.courseInfo}>
            <View style={styles.courseTopRow}>
              <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
              <View style={styles.badgeRow}>
                {isLocked && (
                  <View style={[styles.lockBadge, { backgroundColor: "#CA8A0411", borderColor: "#CA8A04" }]}>
                    <Feather name="lock" size={9} color="#CA8A04" />
                    <Text style={[styles.lockBadgeText, { color: "#CA8A04" }]}>Pro</Text>
                  </View>
                )}
                <Text style={[styles.diffBadge, { color: diffColor }]}>{course.difficulty}</Text>
              </View>
            </View>
            <Text style={[styles.courseDesc, { color: colors.textMuted }]} numberOfLines={1}>
              {course.description}
            </Text>
            <View style={styles.courseFooter}>
              <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
                <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: isLocked ? "#CA8A04" : course.color }]} />
              </View>
              <Text style={[styles.lessonCount, { color: colors.textMuted }]}>
                {isLocked ? `${course.totalLessons} lessons` : `${course.completedLessons}/${course.totalLessons}`}
              </Text>
            </View>
          </View>
          <Feather name={isLocked ? "lock" : "chevron-right"} size={15} color={colors.textMuted} />
        </View>
        {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />}
      </Pressable>
    );
  };

  const totalCourses = courses.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Courses</Text>
        <Text style={[styles.screenSub, { color: colors.textMuted }]}>{totalCourses} courses available</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Premium banner for free users */}
      {!isPremium && (
        <View style={styles.bannerSection}>
          <Pressable
            onPress={() => router.push("/premium")}
            style={({ pressed }) => [styles.premiumBanner, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder, opacity: pressed ? 0.8 : 1 }]}
          >
            <View style={[styles.bannerIconBox, { backgroundColor: colors.backgroundTertiary }]}>
              <Feather name="star" size={20} color="#CA8A04" />
            </View>
            <View style={styles.bannerText}>
              <Text style={[styles.bannerTitle, { color: colors.text }]}>Unlock Premium Courses</Text>
              <Text style={[styles.bannerSub, { color: colors.textMuted }]}>Cloud, DevOps, ML, CCNA, Sec+ · $9.99/mo</Text>
            </View>
            <Feather name="arrow-right" size={16} color={colors.textMuted} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.separator, marginTop: 8 }]} />
        </View>
      )}

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersScroll}
      >
        {CATEGORY_FILTERS.map((f) => (
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

      {/* All / filtered mode */}
      {activeFilter === "All" ? (
        <>
          {/* Free courses */}
          <View style={styles.categorySection}>
            <Text style={[styles.categoryLabel, { color: colors.textMuted }]}>FREE COURSES</Text>
            <View style={styles.list}>
              {freeCourses.map((c, i, a) => renderCourseRow(c, i, a))}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.separator }]} />

          {/* Premium courses */}
          <View style={styles.categorySection}>
            <View style={styles.premiumCatHeader}>
              <Text style={[styles.categoryLabel, { color: colors.textMuted }]}>PREMIUM COURSES</Text>
              {!isPremium && (
                <Pressable onPress={() => router.push("/premium")}>
                  <Text style={[styles.unlockLink, { color: "#CA8A04" }]}>Unlock all</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.list}>
              {premiumCourses.map((c, i, a) => renderCourseRow(c, i, a))}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.categorySection}>
          <View style={styles.list}>
            {filteredCourses.map((c, i, a) => renderCourseRow(c, i, a))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  screenTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  screenSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 16 },
  bannerSection: { paddingHorizontal: 20 },
  premiumBanner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  bannerIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  bannerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  filtersScroll: { marginBottom: 16 },
  filters: { paddingHorizontal: 20, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  categorySection: { marginBottom: 8 },
  categoryLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, paddingHorizontal: 20, marginBottom: 10 },
  premiumCatHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 10 },
  unlockLink: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  list: { paddingHorizontal: 20 },
  courseRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  courseIconBox: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  courseInfo: { flex: 1, gap: 4 },
  courseTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  courseTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  lockBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  lockBadgeText: { fontSize: 9, fontFamily: "Inter_700Bold" },
  diffBadge: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  courseDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  courseFooter: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  progressTrack: { flex: 1, height: 2, borderRadius: 1, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 1 },
  lessonCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rowDivider: { height: 1, marginLeft: 52 },
});
