import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useSubscription } from "@/context/SubscriptionContext";

const PREMIUM_FEATURES = [
  { icon: "cloud", title: "Cloud Computing (AWS)", description: "EC2, S3, VPC, Lambda, EKS, cost optimization — full AWS mastery" },
  { icon: "box", title: "DevOps & Docker", description: "Docker, Kubernetes, CI/CD, GitOps, SRE, DevSecOps pipelines" },
  { icon: "cpu", title: "Machine Learning & AI", description: "NumPy, PyTorch, CNNs, NLP, LLMs, RAG, MLOps deployment" },
  { icon: "wifi", title: "Networking (CCNA)", description: "OSI, subnetting, OSPF, BGP, VLANs, VPNs, SDN, IPv6" },
  { icon: "shield", title: "Cybersecurity (Sec+/CEH)", description: "Threats, crypto, pentesting, malware, APTs, incident response" },
  { icon: "zap", title: "Unlimited XP & Challenges", description: "Access all advanced coding challenges and bonus XP rewards" },
  { icon: "award", title: "Premium Certificates", description: "Earn shareable completion certificates for every course" },
  { icon: "star", title: "Offline Downloads", description: "Download lessons and study without an internet connection" },
];

const FREE_FEATURES = [
  "HTML, CSS, JavaScript",
  "Python programming",
  "C# and C++",
  "Basic coding challenges",
  "XP & gamification",
  "Career paths",
];

export default function PremiumScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { subscribe, isPremium, plan, renewalDateFormatted, cancelSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    await subscribe();
    setLoading(false);
    Alert.alert("Welcome to Premium!", "You now have full access to all courses and features.", [{ text: "Start Learning", onPress: () => router.back() }]);
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Subscription",
      "You'll lose access to premium courses at your next billing date. Are you sure?",
      [
        { text: "Keep Premium", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            await cancelSubscription();
            setCancelling(false);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 }}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.cardBorder }]}>
            <Feather name="x" size={18} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.heroSection}>
          <View style={[styles.crownBox, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Feather name="star" size={36} color="#CA8A04" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>TechJourney Premium</Text>
          <Text style={[styles.heroSub, { color: colors.textMuted }]}>
            Unlock every course and master the most in-demand IT skills
          </Text>

          {isPremium ? (
            <View style={[styles.activeBadge, { backgroundColor: "#16A34A11", borderColor: "#16A34A" }]}>
              <Feather name="check-circle" size={14} color="#16A34A" />
              <Text style={[styles.activeBadgeText, { color: "#16A34A" }]}>Active — renews {renewalDateFormatted}</Text>
            </View>
          ) : (
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.text }]}>$9.99</Text>
              <Text style={[styles.pricePer, { color: colors.textMuted }]}> / month</Text>
            </View>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.separator }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Everything included</Text>
          <View style={styles.featureList}>
            {PREMIUM_FEATURES.map((f) => (
              <View key={f.title} style={[styles.featureCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
                <View style={[styles.featureIconBox, { backgroundColor: colors.backgroundTertiary }]}>
                  <Feather name={f.icon as any} size={18} color={colors.text} />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
                  <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{f.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.separator }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Free plan includes</Text>
          <View style={styles.freeList}>
            {FREE_FEATURES.map((f) => (
              <View key={f} style={styles.freeRow}>
                <Feather name="check" size={14} color={colors.accentGreen} />
                <Text style={[styles.freeText, { color: colors.textSecondary }]}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.separator }]} />

        <View style={styles.section}>
          <Text style={[styles.noteText, { color: colors.textMuted }]}>
            Cancel anytime. No long-term commitment. Billed monthly at $9.99. Access continues until the end of the billing period after cancellation.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomCTA, { backgroundColor: colors.background, borderTopColor: colors.separator, paddingBottom: insets.bottom + 16 }]}>
        {isPremium ? (
          <Pressable
            onPress={handleCancel}
            disabled={cancelling}
            style={({ pressed }) => [styles.cancelBtn, { borderColor: colors.cardBorder, opacity: cancelling ? 0.5 : pressed ? 0.7 : 1 }]}
          >
            {cancelling ? <ActivityIndicator size="small" color={colors.text} /> : <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>Cancel Subscription</Text>}
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={handleSubscribe}
              disabled={loading}
              style={({ pressed }) => [styles.subscribeBtn, { backgroundColor: colors.text, opacity: loading ? 0.7 : pressed ? 0.85 : 1 }]}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <>
                  <Feather name="star" size={16} color={colors.background} />
                  <Text style={[styles.subscribeBtnText, { color: colors.background }]}>Start Premium — $9.99/mo</Text>
                </>
              )}
            </Pressable>
            <Text style={[styles.trialNote, { color: colors.textMuted }]}>7-day free trial · Cancel anytime</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  topBar: { paddingHorizontal: 20, marginBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  heroSection: { alignItems: "center", paddingHorizontal: 24, gap: 12, marginBottom: 28 },
  crownBox: { width: 80, height: 80, borderRadius: 24, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  heroTitle: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  heroSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  activeBadgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  priceRow: { flexDirection: "row", alignItems: "baseline" },
  price: { fontSize: 40, fontFamily: "Inter_700Bold" },
  pricePer: { fontSize: 16, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 24 },
  section: { paddingHorizontal: 20, marginBottom: 24, gap: 14 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  featureList: { gap: 10 },
  featureCard: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 14, borderRadius: 12, borderWidth: 1 },
  featureIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  featureText: { flex: 1, gap: 3 },
  featureTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  featureDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  freeList: { gap: 10 },
  freeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  freeText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  noteText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, textAlign: "center" },
  bottomCTA: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, gap: 8 },
  subscribeBtn: { height: 54, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  subscribeBtnText: { fontSize: 17, fontFamily: "Inter_700Bold" },
  trialNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  cancelBtn: { height: 50, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  cancelBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
