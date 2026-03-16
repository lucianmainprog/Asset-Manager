import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

type Tab = "signin" | "signup";

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { login, register, loginWithGoogle, error, clearError } = useAuth();

  const [tab, setTab] = useState<Tab>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (t: Tab) => {
    clearError();
    Animated.timing(slideAnim, {
      toValue: t === "signin" ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setTab(t);
    setName(""); setEmail(""); setPassword(""); setConfirmPass("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    clearError();
    try {
      if (tab === "signin") {
        await login(email, password);
      } else {
        if (password !== confirmPass) return;
        await register(name, email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    clearError();
    try {
      const redirectUri = AuthSession.makeRedirectUri({ scheme: "techjourney" });
      const discoveryUrl = "https://accounts.google.com";
      const discovery = await AuthSession.fetchDiscoveryAsync(discoveryUrl);

      const request = new AuthSession.AuthRequest({
        clientId: "YOUR_GOOGLE_CLIENT_ID",
        scopes: ["openid", "profile", "email"],
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
      });

      const result = await request.promptAsync(discovery, { showInRecents: true });

      if (result.type === "success" && result.authentication?.accessToken) {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
        });
        const googleUser = await res.json();
        await loginWithGoogle({
          name: googleUser.name,
          email: googleUser.email,
          avatar: googleUser.picture,
        });
      } else if (result.type === "error") {
        throw new Error("Google sign-in was cancelled or failed.");
      }
    } catch (e: any) {
      if (e?.message?.includes("YOUR_GOOGLE_CLIENT_ID")) {
        await loginWithGoogle({
          name: "Demo User",
          email: `demo_${Date.now()}@gmail.com`,
          avatar: undefined,
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const tabIndicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["2px", "50%"],
  });

  const passwordsMatch = tab === "signup" && confirmPass.length > 0 && password !== confirmPass;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={[styles.logoBox, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Feather name="code" size={32} color={colors.text} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>TechJourney</Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>Learn IT. Build Careers.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.tabBar, { backgroundColor: colors.backgroundSecondary }]}>
            <Animated.View style={[styles.tabIndicator, { left: tabIndicatorLeft, backgroundColor: colors.background, borderColor: colors.cardBorder }]} />
            <Pressable style={styles.tabBtn} onPress={() => switchTab("signin")}>
              <Text style={[styles.tabText, { color: tab === "signin" ? colors.text : colors.textMuted }]}>Sign In</Text>
            </Pressable>
            <Pressable style={styles.tabBtn} onPress={() => switchTab("signup")}>
              <Text style={[styles.tabText, { color: tab === "signup" ? colors.text : colors.textMuted }]}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {tab === "signup" && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Full Name</Text>
                <View style={[styles.inputWrap, { borderColor: colors.cardBorder, backgroundColor: colors.backgroundSecondary }]}>
                  <Feather name="user" size={16} color={colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your full name"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Email</Text>
              <View style={[styles.inputWrap, { borderColor: colors.cardBorder, backgroundColor: colors.backgroundSecondary }]}>
                <Feather name="mail" size={16} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Password</Text>
              <View style={[styles.inputWrap, { borderColor: colors.cardBorder, backgroundColor: colors.backgroundSecondary }]}>
                <Feather name="lock" size={16} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={tab === "signup" ? "At least 6 characters" : "Your password"}
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  returnKeyType={tab === "signup" ? "next" : "done"}
                  onSubmitEditing={tab === "signin" ? handleSubmit : undefined}
                />
                <Pressable onPress={() => setShowPass(!showPass)}>
                  <Feather name={showPass ? "eye-off" : "eye"} size={16} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>

            {tab === "signup" && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Confirm Password</Text>
                <View style={[styles.inputWrap, { borderColor: passwordsMatch ? "#DC2626" : colors.cardBorder, backgroundColor: colors.backgroundSecondary }]}>
                  <Feather name="lock" size={16} color={passwordsMatch ? "#DC2626" : colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={confirmPass}
                    onChangeText={setConfirmPass}
                    placeholder="Repeat your password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
                {passwordsMatch && (
                  <Text style={styles.fieldError}>Passwords do not match</Text>
                )}
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={loading || passwordsMatch}
              style={({ pressed }) => [styles.primaryBtn, { backgroundColor: colors.text, opacity: loading || passwordsMatch ? 0.5 : pressed ? 0.8 : 1 }]}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Text style={[styles.primaryBtnText, { color: colors.background }]}>
                  {tab === "signin" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.separator }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.separator }]} />
            </View>

            <Pressable
              onPress={handleGoogle}
              disabled={googleLoading}
              style={({ pressed }) => [styles.googleBtn, { borderColor: colors.cardBorder, backgroundColor: colors.backgroundSecondary, opacity: googleLoading ? 0.6 : pressed ? 0.7 : 1 }]}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <>
                  <View style={styles.googleLogo}>
                    <Text style={styles.googleG}>G</Text>
                  </View>
                  <Text style={[styles.googleBtnText, { color: colors.text }]}>Continue with Google</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          By continuing, you agree to our Terms of Service
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 24 },
  logoSection: { alignItems: "center", gap: 10 },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: { fontSize: 28, fontFamily: "Inter_700Bold" },
  tagline: { fontSize: 14, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    padding: 4,
    position: "relative",
    height: 44,
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    width: "50%",
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  form: { padding: 20, gap: 14 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  fieldError: { fontSize: 11, color: "#DC2626", fontFamily: "Inter_500Medium" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#DC262611",
    borderRadius: 8,
  },
  errorText: { color: "#DC2626", fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  primaryBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  googleBtn: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  googleBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  footerText: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
});
