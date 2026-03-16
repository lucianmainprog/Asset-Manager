import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { LessonSection } from "@/data/lessonData";

const SECTIONS: LessonSection[] = ["Beginner", "Intermediate", "Advanced"];

const DIFF_COLORS = {
  Beginner: "#16A34A",
  Intermediate: "#D97706",
  Advanced: "#DC2626",
};

export default function LessonListScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { courses, profile, ALL_LESSONS } = useApp();

  const course = courses.find((c) => c.id === courseId);
  const lessons = ALL_LESSONS[courseId] || [];

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Course not found</Text>
      </View>
    );
  }

  const completedIds = new Set(profile.completedLessons);
  const totalCompleted = lessons.filter((l) => completedIds.has(l.id)).length;
  const progress = lessons.length > 0 ? totalCompleted / lessons.length : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseTopRow}>
          <View style={[styles.langDot, { backgroundColor: course.color }]} />
          <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
        </View>
        <Text style={[styles.courseDesc, { color: colors.textMuted }]}>{course.description}</Text>
        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, { backgroundColor: colors.backgroundTertiary }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: course.color }]} />
          </View>
          <Text style={[styles.progressCount, { color: colors.textMuted }]}>
            {totalCompleted}/{lessons.length}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {SECTIONS.map((section) => {
        const sectionLessons = lessons.filter((l) => l.section === section);
        if (sectionLessons.length === 0) return null;
        const sectionCompleted = sectionLessons.filter((l) => completedIds.has(l.id)).length;

        return (
          <View key={section} style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <View style={[styles.sectionDot, { backgroundColor: DIFF_COLORS[section] }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{section}</Text>
              </View>
              <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
                {sectionCompleted}/{sectionLessons.length}
              </Text>
            </View>

            {sectionLessons.map((lesson, index) => {
              const isCompleted = completedIds.has(lesson.id);
              const isLast = index === sectionLessons.length - 1;
              return (
                <Pressable
                  key={lesson.id}
                  onPress={() =>
                    router.push({ pathname: "/lesson/view/[courseId]/[lessonId]", params: { courseId, lessonId: lesson.id } })
                  }
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <View style={styles.lessonRow}>
                    <View style={[styles.lessonIcon, {
                      backgroundColor: isCompleted ? DIFF_COLORS[section] + "22" : colors.backgroundSecondary,
                      borderColor: isCompleted ? DIFF_COLORS[section] : colors.cardBorder,
                    }]}>
                      {isCompleted
                        ? <Feather name="check" size={12} color={DIFF_COLORS[section]} />
                        : <Text style={[styles.lessonNumText, { color: colors.textMuted }]}>{index + 1}</Text>
                      }
                    </View>
                    <View style={styles.lessonInfo}>
                      <Text style={[styles.lessonTitle, { color: isCompleted ? colors.textMuted : colors.text }]}>
                        {lesson.title}
                      </Text>
                      {lesson.quiz && (
                        <View style={styles.quizTag}>
                          <Feather name="help-circle" size={10} color={colors.textMuted} />
                          <Text style={[styles.quizTagText, { color: colors.textMuted }]}>Quiz included</Text>
                        </View>
                      )}
                    </View>
                    <Feather name="chevron-right" size={15} color={colors.textMuted} />
                  </View>
                  {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator, marginLeft: 64 }]} />}
                </Pressable>
              );
            })}

            <View style={[styles.divider, { backgroundColor: colors.separator, marginTop: 8 }]} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorText: { fontSize: 16, fontFamily: "Inter_500Medium", padding: 20 },
  courseHeader: { padding: 20, gap: 8 },
  courseTopRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  langDot: { width: 12, height: 12, borderRadius: 6 },
  courseTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  courseDesc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  progressTrack: { flex: 1, height: 3, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  progressCount: { fontSize: 12, fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 16 },
  sectionBlock: { marginBottom: 4 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 8 },
  sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 13, fontFamily: "Inter_700Bold", letterSpacing: 0.4 },
  sectionCount: { fontSize: 12, fontFamily: "Inter_500Medium" },
  lessonRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingLeft: 20, paddingRight: 20, paddingVertical: 12 },
  lessonIcon: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  lessonNumText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  lessonInfo: { flex: 1, gap: 2 },
  lessonTitle: { fontSize: 14, fontFamily: "Inter_500Medium" },
  quizTag: { flexDirection: "row", alignItems: "center", gap: 3 },
  quizTagText: { fontSize: 10, fontFamily: "Inter_400Regular" },
  rowDivider: { height: 1 },
});
