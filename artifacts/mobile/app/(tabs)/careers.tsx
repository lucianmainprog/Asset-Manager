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

const CAREERS = [
  {
    id: "networking",
    title: "Networking",
    subtitle: "Build the backbone of the internet",
    icon: "wifi",
    color: "#3B82F6",
    salary: "$65k – $120k",
    demand: "High",
    skills: ["TCP/IP", "Cisco IOS", "Subnetting", "DNS", "DHCP"],
    certifications: ["CCNA", "CompTIA Network+", "CCNP"],
    roles: ["Network Engineer", "Network Admin", "NOC Technician"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Protect systems from threats",
    icon: "shield",
    color: "#EF4444",
    salary: "$80k – $150k",
    demand: "Very High",
    skills: ["Penetration Testing", "SIEM", "Incident Response", "Cryptography"],
    certifications: ["CompTIA Security+", "CEH", "CISSP"],
    roles: ["Security Analyst", "Penetration Tester", "SOC Analyst"],
  },
  {
    id: "software",
    title: "Software Development",
    subtitle: "Build software that powers the world",
    icon: "code",
    color: "#10B981",
    salary: "$85k – $180k",
    demand: "Very High",
    skills: ["JavaScript", "Python", "React", "Node.js", "Git"],
    certifications: ["AWS Developer", "Azure Developer", "Oracle Java"],
    roles: ["Frontend Developer", "Backend Developer", "Full Stack Engineer"],
  },
  {
    id: "cloud",
    title: "Cloud Engineering",
    subtitle: "Design scalable cloud infrastructure",
    icon: "cloud",
    color: "#F59E0B",
    salary: "$95k – $180k",
    demand: "Very High",
    skills: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform"],
    certifications: ["AWS Solutions Architect", "Azure Administrator", "GCP Associate"],
    roles: ["Cloud Architect", "Cloud Engineer", "DevOps Engineer"],
  },
  {
    id: "devops",
    title: "DevOps",
    subtitle: "Bridge development and operations",
    icon: "refresh-cw",
    color: "#8B5CF6",
    salary: "$90k – $170k",
    demand: "High",
    skills: ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Ansible"],
    certifications: ["AWS DevOps", "CKA", "HashiCorp Terraform"],
    roles: ["DevOps Engineer", "SRE", "Platform Engineer"],
  },
  {
    id: "datascience",
    title: "Data Science",
    subtitle: "Turn data into insights",
    icon: "bar-chart-2",
    color: "#EC4899",
    salary: "$90k – $175k",
    demand: "High",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Tableau"],
    certifications: ["AWS Data Analytics", "Google Data Analytics", "IBM Data Science"],
    roles: ["Data Scientist", "Data Analyst", "ML Engineer"],
  },
];

export default function CareersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 10;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 80;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Careers</Text>
        <Text style={[styles.screenSub, { color: colors.textSecondary }]}>
          Explore IT career paths and find your direction
        </Text>
      </View>

      <View style={styles.cards}>
        {CAREERS.map((career) => (
          <Pressable
            key={career.id}
            onPress={() => router.push(`/career/${career.id}`)}
            style={({ pressed }) => [
              styles.careerCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <View style={[styles.cardLeft, { borderLeftColor: career.color }]}>
              <View style={[styles.iconBox, { backgroundColor: career.color + "22" }]}>
                <Feather name={career.icon as any} size={24} color={career.color} />
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.careerTitle, { color: colors.text }]}>{career.title}</Text>
                <View
                  style={[
                    styles.demandBadge,
                    {
                      backgroundColor:
                        career.demand === "Very High" ? "#10B98122" : "#F59E0B22",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.demandText,
                      { color: career.demand === "Very High" ? "#10B981" : "#F59E0B" },
                    ]}
                  >
                    {career.demand} demand
                  </Text>
                </View>
              </View>
              <Text style={[styles.careerSub, { color: colors.textSecondary }]}>
                {career.subtitle}
              </Text>
              <View style={styles.salaryRow}>
                <Feather name="dollar-sign" size={13} color={colors.textMuted} />
                <Text style={[styles.salaryText, { color: colors.textMuted }]}>
                  {career.salary} / year
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.skillsScroll}
              >
                {career.skills.slice(0, 3).map((skill) => (
                  <View
                    key={skill}
                    style={[styles.skillChip, { backgroundColor: colors.backgroundTertiary }]}
                  >
                    <Text style={[styles.skillText, { color: colors.textSecondary }]}>{skill}</Text>
                  </View>
                ))}
                {career.skills.length > 3 && (
                  <View style={[styles.skillChip, { backgroundColor: colors.backgroundTertiary }]}>
                    <Text style={[styles.skillText, { color: colors.textMuted }]}>
                      +{career.skills.length - 3}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 4,
  },
  screenTitle: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  screenSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  cards: {
    paddingHorizontal: 20,
    gap: 12,
  },
  careerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  cardLeft: {
    borderLeftWidth: 0,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  careerTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  demandBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  demandText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  careerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  salaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  salaryText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  skillsScroll: {
    marginTop: 4,
  },
  skillChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 5,
  },
  skillText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
