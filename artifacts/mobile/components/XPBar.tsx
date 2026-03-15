import React, { useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface XPBarProps {
  xp: number;
  level: number;
  xpToNext: number;
  progress: number;
  compact?: boolean;
}

export function XPBar({ xp, level, xpToNext, progress, compact = false }: XPBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedBar = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactTrack, { backgroundColor: colors.backgroundTertiary }]}>
          <Animated.View
            style={[
              styles.compactFill,
              { backgroundColor: colors.accent },
              animatedBar,
            ]}
          />
        </View>
        <Text style={[styles.compactXP, { color: colors.textSecondary }]}>
          {xp}/{xpToNext} XP
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Feather name="award" size={14} color={colors.accent} />
          <Text style={[styles.levelText, { color: colors.accent }]}>LVL {level}</Text>
        </View>
        <Text style={[styles.xpText, { color: colors.textSecondary }]}>
          {xp} / {xpToNext} XP
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.backgroundTertiary }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: colors.accent },
            animatedBar,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  levelText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  xpText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  compactContainer: {
    gap: 4,
  },
  compactTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  compactFill: {
    height: "100%",
    borderRadius: 2,
  },
  compactXP: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
