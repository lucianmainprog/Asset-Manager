import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
  Switch,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, updateName } = useApp();
  const { user, logout } = useAuth();
  const { isPremium, renewalDateFormatted } = useSubscription();
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  const [notifLessons, setNotifLessons] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [notifChallenges, setNotifChallenges] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const handleSaveName = async () => {
    if (nameInput.trim()) {
      await updateName(nameInput.trim());
    }
    setEditingName(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all progress. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenTitle, { color: colors.text }]}>Settings</Text>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      {/* Account */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCOUNT</Text>

        <View style={[styles.card, { borderColor: colors.cardBorder }]}>
          <View style={styles.cardRow}>
            <View style={styles.rowLeft}>
              <Feather name="user" size={16} color={colors.textMuted} />
              <Text style={[styles.rowLabel, { color: colors.textMuted }]}>Display Name</Text>
            </View>
            {editingName ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  style={[styles.nameInput, { color: colors.text, borderColor: colors.cardBorder }]}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                />
                <Pressable onPress={handleSaveName} style={[styles.saveBtn, { backgroundColor: colors.text }]}>
                  <Text style={[styles.saveBtnText, { color: colors.background }]}>Save</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => { setNameInput(profile.name); setEditingName(true); }} style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: colors.text }]}>{profile.name}</Text>
                <Feather name="edit-2" size={13} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />

          <View style={styles.cardRow}>
            <View style={styles.rowLeft}>
              <Feather name="mail" size={16} color={colors.textMuted} />
              <Text style={[styles.rowLabel, { color: colors.textMuted }]}>Email</Text>
            </View>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]} numberOfLines={1}>
              {user?.email ?? "—"}
            </Text>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />

          <Pressable
            onPress={() => router.push("/premium")}
            style={({ pressed }) => [styles.cardRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="star" size={16} color={isPremium ? "#CA8A04" : colors.textMuted} />
              <Text style={[styles.rowLabel, { color: colors.textMuted }]}>Subscription</Text>
            </View>
            <View style={styles.rowRight}>
              {isPremium ? (
                <View style={[styles.premiumBadge, { backgroundColor: "#CA8A0411", borderColor: "#CA8A04" }]}>
                  <Text style={[styles.premiumBadgeText, { color: "#CA8A04" }]}>Premium</Text>
                </View>
              ) : (
                <Text style={[styles.rowValue, { color: colors.textMuted }]}>Free</Text>
              )}
              <Feather name="chevron-right" size={14} color={colors.textMuted} />
            </View>
          </Pressable>

          {isPremium && renewalDateFormatted && (
            <>
              <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />
              <View style={styles.cardRow}>
                <View style={styles.rowLeft}>
                  <Feather name="refresh-cw" size={16} color={colors.textMuted} />
                  <Text style={[styles.rowLabel, { color: colors.textMuted }]}>Next Billing</Text>
                </View>
                <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{renewalDateFormatted}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>NOTIFICATIONS</Text>

        <View style={[styles.card, { borderColor: colors.cardBorder }]}>
          {[
            { label: "Daily lesson reminders", value: notifLessons, setter: setNotifLessons, icon: "book-open" },
            { label: "Streak reminders", value: notifStreak, setter: setNotifStreak, icon: "zap" },
            { label: "New challenge alerts", value: notifChallenges, setter: setNotifChallenges, icon: "code" },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <View style={styles.cardRow}>
                <View style={styles.rowLeft}>
                  <Feather name={item.icon as any} size={16} color={colors.textMuted} />
                  <Text style={[styles.rowLabel, { color: colors.text }]}>{item.label}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.setter}
                  trackColor={{ false: colors.backgroundTertiary, true: colors.text }}
                  thumbColor={colors.background}
                />
              </View>
              {i < arr.length - 1 && <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Progress */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>YOUR PROGRESS</Text>

        <View style={[styles.card, { borderColor: colors.cardBorder }]}>
          {[
            { label: "Lessons completed", value: profile.completedLessons.length, icon: "check-circle" },
            { label: "Total XP earned", value: `${profile.xp} XP`, icon: "award" },
            { label: "Current level", value: `Level ${profile.level}`, icon: "trending-up" },
            { label: "Day streak", value: `${profile.streak} days`, icon: "zap" },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <View style={styles.cardRow}>
                <View style={styles.rowLeft}>
                  <Feather name={item.icon as any} size={16} color={colors.textMuted} />
                  <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{item.label}</Text>
                </View>
                <Text style={[styles.rowValue, { color: colors.text }]}>{item.value}</Text>
              </View>
              {i < arr.length - 1 && <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* App */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>APP</Text>

        <View style={[styles.card, { borderColor: colors.cardBorder }]}>
          {[
            { label: "Version", value: "1.0.0", icon: "info" },
            { label: "Privacy Policy", value: "", icon: "lock", chevron: true },
            { label: "Terms of Service", value: "", icon: "file-text", chevron: true },
            { label: "Send Feedback", value: "", icon: "message-circle", chevron: true },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <View style={styles.cardRow}>
                <View style={styles.rowLeft}>
                  <Feather name={item.icon as any} size={16} color={colors.textMuted} />
                  <Text style={[styles.rowLabel, { color: colors.text }]}>{item.label}</Text>
                </View>
                <View style={styles.rowRight}>
                  {item.value ? <Text style={[styles.rowValue, { color: colors.textMuted }]}>{item.value}</Text> : null}
                  {item.chevron && <Feather name="chevron-right" size={14} color={colors.textMuted} />}
                </View>
              </View>
              {i < arr.length - 1 && <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <View style={[styles.card, { borderColor: colors.cardBorder }]}>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [styles.cardRow, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="log-out" size={16} color={colors.danger} />
              <Text style={[styles.rowLabel, { color: colors.danger }]}>Sign Out</Text>
            </View>
          </Pressable>

          <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />

          <Pressable
            onPress={handleDeleteAccount}
            style={({ pressed }) => [styles.cardRow, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="trash-2" size={16} color={colors.danger} />
              <Text style={[styles.rowLabel, { color: colors.danger }]}>Delete Account</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenTitle: { fontSize: 28, fontFamily: "Inter_700Bold", paddingHorizontal: 20, marginBottom: 16 },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 24 },
  section: { paddingHorizontal: 20, marginBottom: 24, gap: 10 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 2 },
  card: { borderWidth: 1, borderRadius: 14, overflow: "hidden" },
  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  rowValue: { fontSize: 14, fontFamily: "Inter_400Regular" },
  rowDivider: { height: 1, marginLeft: 46 },
  premiumBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  premiumBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  nameEditRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" },
  nameInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 14, fontFamily: "Inter_400Regular", minWidth: 120 },
  saveBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  saveBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
