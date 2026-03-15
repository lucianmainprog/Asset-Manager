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
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const LESSON_CONTENT: Record<string, { title: string; content: string; code?: string; quiz?: { question: string; options: string[]; correct: number } }[]> = {
  html: [
    {
      title: "Introduction to HTML",
      content: "HTML (HyperText Markup Language) is the standard language for creating web pages. It describes the structure of web content using a series of elements.",
      code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>',
      quiz: { question: "What does HTML stand for?", options: ["HyperText Markup Language", "High Text Machine Language", "HyperText Machine Language", "None of these"], correct: 0 },
    },
    {
      title: "HTML Elements & Tags",
      content: "HTML elements are the building blocks of HTML pages. An element usually consists of an opening tag, content, and a closing tag.",
      code: '<h1>Heading 1</h1>\n<p>This is a paragraph.</p>\n<a href="https://example.com">A link</a>\n<img src="image.jpg" alt="An image" />',
    },
    {
      title: "HTML Structure",
      content: "A well-structured HTML document uses semantic elements that give meaning to the content, making it accessible and SEO-friendly.",
      code: '<header>\n  <nav>...</nav>\n</header>\n<main>\n  <article>...</article>\n  <aside>...</aside>\n</main>\n<footer>...</footer>',
    },
  ],
  css: [
    {
      title: "Introduction to CSS",
      content: "CSS (Cascading Style Sheets) is the language for styling web pages. It controls layout, colors, fonts, and overall visual presentation.",
      code: 'body {\n  font-family: Arial, sans-serif;\n  color: #333;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #1a1a2e;\n  font-size: 2rem;\n}',
    },
    {
      title: "CSS Selectors",
      content: "CSS selectors are patterns used to select elements you want to style. There are many types: element, class, ID, and attribute selectors.",
      code: '/* Element selector */\np { color: blue; }\n\n/* Class selector */\n.highlight { background: yellow; }\n\n/* ID selector */\n#header { font-size: 24px; }',
    },
  ],
  javascript: [
    {
      title: "Introduction to JavaScript",
      content: "JavaScript is a lightweight, interpreted programming language with first-class functions. It is most well-known as the scripting language for Web pages.",
      code: '// Variables\nlet name = "Alice";\nconst age = 25;\n\n// Function\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet(name));',
    },
    {
      title: "JavaScript Arrays",
      content: "Arrays are used to store multiple values in a single variable. JavaScript arrays are dynamic and can hold any type of value.",
      code: 'const fruits = ["apple", "banana", "cherry"];\n\n// Access\nconsole.log(fruits[0]); // "apple"\n\n// Methods\nfruits.push("date");\nfruits.forEach(f => console.log(f));',
    },
    {
      title: "Arrow Functions",
      content: "Arrow functions provide a shorter syntax for function expressions. They are especially useful for callbacks and functional programming.",
      code: '// Traditional\nfunction add(a, b) {\n  return a + b;\n}\n\n// Arrow function\nconst addArrow = (a, b) => a + b;\n\nconsole.log(addArrow(3, 5)); // 8',
    },
  ],
  python: [
    {
      title: "Introduction to Python",
      content: "Python is a high-level, interpreted language known for its clear syntax and readability. It supports multiple programming paradigms.",
      code: 'name = "Alice"\nage = 25\n\nprint(f"Hello, {name}!")\nprint(f"You are {age} years old.")',
    },
    {
      title: "Python Lists",
      content: "Lists are Python's most versatile data type. They can contain different data types and support various built-in operations.",
      code: 'fruits = ["apple", "banana", "cherry"]\n\n# Access\nprint(fruits[0])  # apple\n\n# Methods\nfruits.append("date")\nfor fruit in fruits:\n    print(fruit)',
    },
    {
      title: "Python Functions",
      content: "Functions in Python allow you to encapsulate a task and reuse it. Python supports default arguments, keyword arguments, and more.",
      code: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))\nprint(greet("Bob", "Hi"))',
    },
  ],
  csharp: [
    {
      title: "Introduction to C#",
      content: "C# is a modern, object-oriented language developed by Microsoft. It is used for building Windows applications, games with Unity, and web apps with ASP.NET.",
      code: 'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string name = "Alice";\n        Console.WriteLine($"Hello, {name}!");\n    }\n}',
    },
    {
      title: "C# Classes & Objects",
      content: "C# is fully object-oriented. Classes are blueprints for objects. They encapsulate data (fields) and behavior (methods).",
      code: 'public class Car\n{\n    public string Make { get; set; }\n    public int Year { get; set; }\n\n    public void Start()\n    {\n        Console.WriteLine($"{Make} started!");\n    }\n}',
    },
  ],
  cpp: [
    {
      title: "Introduction to C++",
      content: "C++ is a powerful, general-purpose language. It offers both high-level and low-level memory management, making it ideal for systems programming and games.",
      code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    string name = "Alice";\n    cout << "Hello, " << name << "!" << endl;\n    return 0;\n}',
    },
    {
      title: "C++ Pointers",
      content: "Pointers are variables that store memory addresses. They are fundamental to C++ and allow direct memory manipulation.",
      code: 'int x = 42;\nint* ptr = &x;\n\ncout << "Value: " << x << endl;\ncout << "Address: " << &x << endl;\ncout << "Via pointer: " << *ptr << endl;',
    },
  ],
};

export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { courses, profile, completeLesson } = useApp();

  const course = courses.find((c) => c.id === courseId);
  const lessons = LESSON_CONTENT[courseId] || [];

  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Course not found</Text>
      </View>
    );
  }

  const lesson = lessons[currentLesson];
  const isCompleted = lesson ? profile.completedLessons.includes(`${courseId}_${currentLesson}`) : false;

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeLesson(`${courseId}_${currentLesson}`, courseId, course.xpReward);
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setQuizAnswered(false);
    }
  };

  const handleAnswerQuiz = (idx: number) => {
    if (quizAnswered) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(idx);
    setQuizAnswered(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.progressBar, { backgroundColor: colors.backgroundTertiary }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentLesson + 1) / lessons.length) * 100}%`,
              backgroundColor: course.color,
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonMeta}>
            <Text style={[styles.lessonNum, { color: colors.textMuted }]}>
              Lesson {currentLesson + 1} of {lessons.length}
            </Text>
            {isCompleted && (
              <View style={[styles.completedBadge, { backgroundColor: "#10B98122" }]}>
                <Feather name="check" size={11} color="#10B981" />
                <Text style={[styles.completedBadgeText, { color: "#10B981" }]}>Done</Text>
              </View>
            )}
          </View>
          <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson?.title}</Text>
        </View>

        <Text style={[styles.lessonContent, { color: colors.textSecondary }]}>
          {lesson?.content}
        </Text>

        {lesson?.code && (
          <View style={[styles.codeBlock, { backgroundColor: isDark ? "#0A0E1A" : "#0D1B2E" }]}>
            <View style={styles.codeHeader}>
              <View style={styles.codeDots}>
                <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
                <View style={[styles.dot, { backgroundColor: "#F59E0B" }]} />
                <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
              </View>
              <Text style={styles.codeLang}>{course.language}</Text>
            </View>
            <Text style={styles.codeText}>{lesson.code}</Text>
          </View>
        )}

        {lesson?.quiz && !showQuiz && (
          <Pressable
            onPress={() => setShowQuiz(true)}
            style={({ pressed }) => [
              styles.quizBtn,
              { backgroundColor: colors.backgroundTertiary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="help-circle" size={18} color={colors.accent} />
            <Text style={[styles.quizBtnText, { color: colors.accent }]}>Take a quick quiz</Text>
          </Pressable>
        )}

        {lesson?.quiz && showQuiz && (
          <View style={[styles.quizCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.quizQuestion, { color: colors.text }]}>{lesson.quiz.question}</Text>
            <View style={styles.quizOptions}>
              {lesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === lesson.quiz!.correct;
                let bgColor = colors.backgroundTertiary;
                let borderColor = "transparent";
                if (quizAnswered && isSelected && isCorrect) { bgColor = "#10B98122"; borderColor = "#10B981"; }
                if (quizAnswered && isSelected && !isCorrect) { bgColor = "#EF444422"; borderColor = "#EF4444"; }
                if (quizAnswered && !isSelected && isCorrect) { bgColor = "#10B98122"; borderColor = "#10B981"; }

                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleAnswerQuiz(idx)}
                    style={[styles.quizOption, { backgroundColor: bgColor, borderColor }]}
                  >
                    <Text style={[styles.quizOptionText, { color: colors.text }]}>{opt}</Text>
                    {quizAnswered && isCorrect && (
                      <Feather name="check-circle" size={16} color="#10B981" />
                    )}
                    {quizAnswered && isSelected && !isCorrect && (
                      <Feather name="x-circle" size={16} color="#EF4444" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.cardBorder, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.navBtns}>
          <Pressable
            onPress={() => { if (currentLesson > 0) { setCurrentLesson(currentLesson - 1); setShowQuiz(false); setSelectedAnswer(null); setQuizAnswered(false); } }}
            style={[styles.navBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder, opacity: currentLesson === 0 ? 0.4 : 1 }]}
            disabled={currentLesson === 0}
          >
            <Feather name="arrow-left" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={handleComplete}
            style={[styles.completeBtn, { backgroundColor: isCompleted ? "#10B981" : course.color }]}
          >
            <Feather name={isCompleted ? "check" : "zap"} size={16} color="#FFF" />
            <Text style={styles.completeBtnText}>
              {isCompleted
                ? "Completed"
                : currentLesson < lessons.length - 1
                ? `Next (+${course.xpReward} XP)`
                : `Finish (+${course.xpReward} XP)`}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  progressBar: {
    height: 3,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  lessonHeader: {
    gap: 6,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lessonNum: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  lessonTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  lessonContent: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  codeBlock: {
    borderRadius: 12,
    overflow: "hidden",
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  codeDots: {
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  codeLang: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.4)",
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 13,
    color: "#00D4FF",
    padding: 14,
    lineHeight: 22,
  },
  quizBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  quizBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  quizCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  quizQuestion: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
  },
  quizOptions: {
    gap: 8,
  },
  quizOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
  },
  quizOptionText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  bottomBar: {
    borderTopWidth: 1,
    padding: 12,
  },
  navBtns: {
    flexDirection: "row",
    gap: 10,
  },
  navBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  completeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: 12,
  },
  completeBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
});
