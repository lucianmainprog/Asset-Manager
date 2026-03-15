import React, { useState } from "react";
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
import { LESSON_DATA } from "@/data/lessonData";

export default function LessonViewScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { courseId, lessonId } = useLocalSearchParams<{ courseId: string; lessonId: string }>();
  const { completeLesson, courses, profile } = useApp();
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [completing, setCompleting] = useState(false);

  const lessons = LESSON_DATA[courseId] || [];
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[lessonIndex];
  const course = courses.find((c) => c.id === courseId);

  if (!lesson || !course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Lesson not found</Text>
      </View>
    );
  }

  const isCompleted = profile.completedLessons.includes(lesson.id);
  const nextLesson = lessons[lessonIndex + 1];
  const prevLesson = lessons[lessonIndex - 1];
  const hasQuiz = !!lesson.quiz;
  const isCorrect = selectedOption === lesson.quiz?.correct;

  const handleComplete = async () => {
    if (completing) return;
    setCompleting(true);
    if (!isCompleted) {
      await completeLesson(lesson.id, courseId, course.xpReward);
    }
    setCompleting(false);

    if (nextLesson) {
      router.replace({
        pathname: "/lesson/view/[courseId]/[lessonId]",
        params: { courseId, lessonId: nextLesson.id },
      });
    } else {
      router.back();
    }
  };

  const handleAnswerQuiz = (optionIndex: number) => {
    if (quizAnswered) return;
    setSelectedOption(optionIndex);
    setQuizAnswered(true);
  };

  const diffLabel = lesson.section;
  const diffColor =
    diffLabel === "Beginner" ? "#16A34A" :
    diffLabel === "Intermediate" ? "#D97706" : "#DC2626";

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.lessonMeta}>
          <View style={[styles.diffPill, { borderColor: diffColor }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{diffLabel}</Text>
          </View>
          <Text style={[styles.lessonProgress, { color: colors.textMuted }]}>
            {lessonIndex + 1} of {lessons.length}
          </Text>
        </View>

        <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>

        <View style={[styles.divider, { backgroundColor: colors.separator }]} />

        <Text style={[styles.contentText, { color: colors.textSecondary }]}>
          {lesson.content}
        </Text>

        {lesson.code && (
          <View style={[styles.codeBlock, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <View style={styles.codeHeader}>
              <Feather name="code" size={13} color={colors.textMuted} />
              <Text style={[styles.codeLabel, { color: colors.textMuted }]}>Example</Text>
            </View>
            <Text style={[styles.codeText, { color: colors.text }]}>{lesson.code}</Text>
          </View>
        )}

        {lesson.tip && (
          <View style={[styles.tipBlock, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Feather name="info" size={13} color={colors.textMuted} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>{lesson.tip}</Text>
          </View>
        )}

        {hasQuiz && (
          <View style={styles.quizSection}>
            <View style={[styles.divider, { backgroundColor: colors.separator }]} />
            <View style={styles.quizHeader}>
              <Feather name="help-circle" size={15} color={colors.text} />
              <Text style={[styles.quizTitle, { color: colors.text }]}>Quick Check</Text>
            </View>
            <Text style={[styles.quizQuestion, { color: colors.text }]}>{lesson.quiz!.question}</Text>
            <View style={styles.options}>
              {lesson.quiz!.options.map((option, idx) => {
                let bg = colors.backgroundSecondary;
                let border = colors.cardBorder;
                let textColor = colors.text;
                if (quizAnswered) {
                  if (idx === lesson.quiz!.correct) {
                    bg = "#16A34A11";
                    border = "#16A34A";
                    textColor = "#16A34A";
                  } else if (idx === selectedOption && idx !== lesson.quiz!.correct) {
                    bg = "#DC262611";
                    border = "#DC2626";
                    textColor = "#DC2626";
                  }
                }
                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleAnswerQuiz(idx)}
                    disabled={quizAnswered}
                    style={({ pressed }) => [
                      styles.option,
                      { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                    {quizAnswered && idx === lesson.quiz!.correct && (
                      <Feather name="check" size={15} color="#16A34A" />
                    )}
                    {quizAnswered && idx === selectedOption && idx !== lesson.quiz!.correct && (
                      <Feather name="x" size={15} color="#DC2626" />
                    )}
                  </Pressable>
                );
              })}
            </View>
            {quizAnswered && (
              <Text style={[styles.quizFeedback, { color: isCorrect ? "#16A34A" : "#DC2626" }]}>
                {isCorrect ? "Correct! Well done." : `The correct answer is: ${lesson.quiz!.options[lesson.quiz!.correct]}`}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.separator, paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          onPress={() => prevLesson && router.replace({
            pathname: "/lesson/view/[courseId]/[lessonId]",
            params: { courseId, lessonId: prevLesson.id },
          })}
          disabled={!prevLesson}
          style={[styles.navBtn, { borderColor: colors.cardBorder, opacity: prevLesson ? 1 : 0.3 }]}
        >
          <Feather name="arrow-left" size={18} color={colors.text} />
        </Pressable>

        <Pressable
          onPress={hasQuiz && !quizAnswered ? () => setShowQuiz(true) : handleComplete}
          style={[styles.completeBtn, { backgroundColor: colors.text }]}
        >
          <Text style={[styles.completeBtnText, { color: colors.background }]}>
            {isCompleted
              ? (nextLesson ? "Next" : "Done")
              : (hasQuiz && !quizAnswered ? "Take Quiz" : nextLesson ? "Complete & Next" : "Complete")}
          </Text>
          <Feather name={nextLesson ? "arrow-right" : "check"} size={16} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  errorText: { fontSize: 16, fontFamily: "Inter_500Medium", padding: 20 },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  diffPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  diffText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  lessonProgress: { fontSize: 12, fontFamily: "Inter_500Medium" },
  lessonTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 20,
    paddingBottom: 16,
    lineHeight: 30,
  },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 20 },
  contentText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  codeBlock: {
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  codeLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  codeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12.5,
    lineHeight: 20,
    padding: 14,
  },
  tipBlock: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  tipText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  quizSection: { paddingBottom: 8 },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  quizTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  quizQuestion: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: 20,
    marginBottom: 12,
    lineHeight: 22,
  },
  options: { paddingHorizontal: 20, gap: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1 },
  quizFeedback: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: 20,
    marginTop: 12,
  },
  bottomBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  completeBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  completeBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
