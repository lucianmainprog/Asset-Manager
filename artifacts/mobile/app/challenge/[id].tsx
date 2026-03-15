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
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const DIFF_COLORS = {
  Beginner: "#10B981",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

export default function ChallengeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { challenges, completeChallenge } = useApp();

  const challenge = challenges.find((c) => c.id === id);
  const [code, setCode] = useState(challenge?.starterCode || "");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!challenge) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Challenge not found</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (code.trim().length < 10) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
    setShowSuccess(true);
    if (!challenge.completed) {
      await completeChallenge(challenge.id, challenge.xpReward);
    }
  };

  const diffColor = DIFF_COLORS[challenge.difficulty];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: diffColor + "22" }]}>
              <Text style={[styles.tagText, { color: diffColor }]}>{challenge.difficulty}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{challenge.language}</Text>
            </View>
          </View>
          <View style={[styles.xpBadge, { backgroundColor: isDark ? "#00D4FF22" : "#1E3A8A22" }]}>
            <Feather name="zap" size={13} color={colors.accent} />
            <Text style={[styles.xpText, { color: colors.accent }]}>+{challenge.xpReward} XP</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{challenge.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{challenge.description}</Text>

        <Pressable
          onPress={() => setShowHint(!showHint)}
          style={[styles.hintBtn, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Feather name={showHint ? "eye-off" : "eye"} size={15} color={colors.textSecondary} />
          <Text style={[styles.hintBtnText, { color: colors.textSecondary }]}>
            {showHint ? "Hide hint" : "Show hint"}
          </Text>
        </Pressable>

        {showHint && (
          <View style={[styles.hintCard, { backgroundColor: "#F59E0B22", borderColor: "#F59E0B44" }]}>
            <Feather name="info" size={15} color="#F59E0B" />
            <Text style={[styles.hintText, { color: colors.text }]}>{challenge.hint}</Text>
          </View>
        )}

        <Text style={[styles.editorLabel, { color: colors.textSecondary }]}>Your Solution</Text>
        <View style={[styles.editorWrapper, { backgroundColor: isDark ? "#0A0E1A" : "#0D1B2E", borderColor: isDark ? "#1E3A5F" : "#334155" }]}>
          <View style={styles.editorHeader}>
            <View style={styles.codeDots}>
              <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
              <View style={[styles.dot, { backgroundColor: "#F59E0B" }]} />
              <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
            </View>
            <Text style={styles.editorLang}>{challenge.language}</Text>
          </View>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            editable={!submitted}
            placeholder="Write your solution here..."
            placeholderTextColor="rgba(255,255,255,0.2)"
          />
        </View>

        {showSuccess && (
          <View style={[styles.successCard, { backgroundColor: "#10B98122", borderColor: "#10B98155" }]}>
            <Feather name="check-circle" size={24} color="#10B981" />
            <View style={styles.successInfo}>
              <Text style={[styles.successTitle, { color: colors.text }]}>Challenge Submitted!</Text>
              <Text style={[styles.successSub, { color: colors.textSecondary }]}>
                +{challenge.xpReward} XP earned. Great work!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.cardBorder, paddingBottom: insets.bottom + 8 }]}>
        {submitted ? (
          <Pressable
            onPress={() => router.back()}
            style={[styles.submitBtn, { backgroundColor: "#10B981" }]}
          >
            <Feather name="arrow-left" size={16} color="#FFF" />
            <Text style={styles.submitBtnText}>Back to Challenges</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSubmit}
            style={[styles.submitBtn, { backgroundColor: colors.accent, opacity: code.trim().length < 10 ? 0.5 : 1 }]}
            disabled={code.trim().length < 10}
          >
            <Feather name="send" size={16} color="#FFF" />
            <Text style={styles.submitBtnText}>Submit Solution</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tags: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  hintBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  hintBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  hintCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  editorLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  editorWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    minHeight: 200,
  },
  editorHeader: {
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
  editorLang: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.4)",
  },
  codeInput: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 13,
    color: "#00D4FF",
    padding: 14,
    lineHeight: 22,
    minHeight: 160,
    textAlignVertical: "top",
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  successInfo: {
    flex: 1,
    gap: 2,
  },
  successTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  successSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  bottomBar: {
    padding: 12,
    borderTopWidth: 1,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 12,
  },
  submitBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
});
