import React from "react";
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

export const CAREERS = [
  {
    id: "networking",
    title: "Networking",
    subtitle: "Build the backbone of the internet",
    icon: "wifi",
    color: "#3B82F6",
    salary: "$65k – $120k",
    demand: "High",
    skills: ["TCP/IP", "Cisco IOS", "Subnetting", "DNS", "DHCP", "Firewalls", "VLANs"],
    certifications: ["CompTIA Network+", "CCNA", "CCNP", "Juniper JNCIA"],
    roles: [
      { title: "Network Engineer", salary: "$75k – $110k" },
      { title: "Network Administrator", salary: "$60k – $90k" },
      { title: "NOC Technician", salary: "$50k – $75k" },
      { title: "Network Architect", salary: "$110k – $150k" },
    ],
    requiredCourses: [
      { id: "python", reason: "Scripting & automation" },
      { id: "cpp", reason: "Low-level protocol work" },
    ],
    requiredSkillsOutside: ["TCP/IP Fundamentals", "Linux CLI", "Wireshark", "Cisco Packet Tracer"],
    roadmap: ["Learn TCP/IP fundamentals", "Study Network+ curriculum", "Get CCNA certified", "Build a home lab", "Apply for NOC roles"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Protect systems from threats",
    icon: "shield",
    color: "#EF4444",
    salary: "$80k – $150k",
    demand: "Very High",
    skills: ["Penetration Testing", "SIEM", "Incident Response", "Cryptography", "Malware Analysis", "OSINT"],
    certifications: ["CompTIA Security+", "CEH", "CISSP", "OSCP", "CISA"],
    roles: [
      { title: "Security Analyst", salary: "$80k – $115k" },
      { title: "Penetration Tester", salary: "$95k – $140k" },
      { title: "SOC Analyst", salary: "$65k – $100k" },
      { title: "CISO", salary: "$150k – $250k" },
    ],
    requiredCourses: [
      { id: "python", reason: "Scripting, exploit dev, automation" },
      { id: "javascript", reason: "Web vulnerability assessment (XSS, etc.)" },
      { id: "cpp", reason: "Reverse engineering & low-level exploits" },
    ],
    requiredSkillsOutside: ["Linux & Bash", "Networking fundamentals", "Kali Linux", "Metasploit", "Burp Suite"],
    roadmap: ["Learn Linux and networking", "Get Security+ certified", "Practice CTF challenges", "Learn penetration testing tools", "Get CEH or OSCP"],
  },
  {
    id: "software",
    title: "Software Development",
    subtitle: "Build software that powers the world",
    icon: "code",
    color: "#10B981",
    salary: "$85k – $180k",
    demand: "Very High",
    skills: ["JavaScript", "Python", "React", "Node.js", "Git", "REST APIs", "Testing"],
    certifications: ["AWS Developer", "Azure Developer", "Oracle Java SE", "Google Associate Engineer"],
    roles: [
      { title: "Frontend Developer", salary: "$80k – $140k" },
      { title: "Backend Developer", salary: "$90k – $155k" },
      { title: "Full Stack Engineer", salary: "$100k – $170k" },
      { title: "Mobile Developer", salary: "$90k – $160k" },
    ],
    requiredCourses: [
      { id: "html", reason: "Web structure fundamentals" },
      { id: "css", reason: "UI design and styling" },
      { id: "javascript", reason: "Core web programming language" },
      { id: "python", reason: "Backend development & scripting" },
      { id: "csharp", reason: "Enterprise app development (.NET)" },
    ],
    requiredSkillsOutside: ["Git & GitHub", "React or Vue", "Node.js / Express", "SQL databases", "REST API design"],
    roadmap: ["Learn HTML, CSS, JavaScript", "Build projects and portfolio", "Learn a framework (React/Vue)", "Add backend skills (Node/Python)", "Apply for junior developer roles"],
  },
  {
    id: "cloud",
    title: "Cloud Engineering",
    subtitle: "Design scalable cloud infrastructure",
    icon: "cloud",
    color: "#F59E0B",
    salary: "$95k – $180k",
    demand: "Very High",
    skills: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Docker", "IaC"],
    certifications: ["AWS Solutions Architect", "Azure Administrator", "GCP Associate", "Terraform Associate"],
    roles: [
      { title: "Cloud Architect", salary: "$130k – $180k" },
      { title: "Cloud Engineer", salary: "$100k – $150k" },
      { title: "SRE", salary: "$120k – $170k" },
      { title: "Platform Engineer", salary: "$110k – $160k" },
    ],
    requiredCourses: [
      { id: "python", reason: "Infrastructure automation & scripting" },
      { id: "javascript", reason: "Serverless functions & Lambda" },
    ],
    requiredSkillsOutside: ["Linux administration", "Networking fundamentals", "Docker & containers", "Terraform / CloudFormation", "CI/CD pipelines"],
    roadmap: ["Get AWS Cloud Practitioner", "Learn Linux and networking", "Study Solutions Architect Associate", "Practice with real AWS projects", "Get certified and apply"],
  },
  {
    id: "devops",
    title: "DevOps",
    subtitle: "Bridge development and operations",
    icon: "refresh-cw",
    color: "#8B5CF6",
    salary: "$90k – $170k",
    demand: "High",
    skills: ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Ansible", "Prometheus", "GitOps"],
    certifications: ["AWS DevOps Professional", "CKA", "HashiCorp Terraform", "GitLab DevOps"],
    roles: [
      { title: "DevOps Engineer", salary: "$100k – $155k" },
      { title: "Site Reliability Engineer", salary: "$120k – $170k" },
      { title: "Platform Engineer", salary: "$105k – $155k" },
      { title: "Build/Release Engineer", salary: "$85k – $130k" },
    ],
    requiredCourses: [
      { id: "python", reason: "Automation, scripting, tooling" },
      { id: "javascript", reason: "Web app understanding & monitoring" },
    ],
    requiredSkillsOutside: ["Linux & Bash scripting", "Docker & Kubernetes", "CI/CD (GitHub Actions / Jenkins)", "Monitoring (Grafana/Prometheus)", "Git version control"],
    roadmap: ["Master Linux and scripting", "Learn Docker and containers", "Study Kubernetes fundamentals", "Build CI/CD pipelines", "Get CKA or AWS DevOps certified"],
  },
  {
    id: "datascience",
    title: "Data Science",
    subtitle: "Turn data into insights",
    icon: "bar-chart-2",
    color: "#EC4899",
    salary: "$90k – $175k",
    demand: "High",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Tableau", "Statistics", "Pandas"],
    certifications: ["AWS Data Analytics", "Google Data Analytics", "IBM Data Science", "Databricks Associate"],
    roles: [
      { title: "Data Scientist", salary: "$100k – $160k" },
      { title: "Data Analyst", salary: "$70k – $120k" },
      { title: "ML Engineer", salary: "$120k – $175k" },
      { title: "Data Engineer", salary: "$110k – $165k" },
    ],
    requiredCourses: [
      { id: "python", reason: "Primary data science language (Pandas, NumPy, Scikit-learn)" },
      { id: "javascript", reason: "Data visualization on the web (D3.js)" },
    ],
    requiredSkillsOutside: ["Statistics & probability", "SQL & databases", "Pandas & NumPy", "Scikit-learn / TensorFlow", "Data visualization tools"],
    roadmap: ["Learn Python and statistics", "Master Pandas and SQL", "Take a machine learning course", "Build a portfolio of projects", "Get Google Data Analytics certified"],
  },
];

export default function CareersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 16;
  const bottomPadding = Platform.OS === "web" ? 34 + 84 : insets.bottom + 90;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Careers</Text>
        <Text style={[styles.screenSub, { color: colors.textMuted }]}>6 IT career paths</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.list}>
        {CAREERS.map((career, index) => {
          const isLast = index === CAREERS.length - 1;
          return (
            <Pressable
              key={career.id}
              onPress={() => router.push(`/career/${career.id}`)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <View style={styles.careerRow}>
                <View style={[styles.iconBox, { backgroundColor: career.color + "18" }]}>
                  <Feather name={career.icon as any} size={20} color={career.color} />
                </View>
                <View style={styles.careerInfo}>
                  <View style={styles.careerTopRow}>
                    <Text style={[styles.careerTitle, { color: colors.text }]}>{career.title}</Text>
                    <Text style={[styles.demandBadge, {
                      color: career.demand === "Very High" ? "#16A34A" : "#D97706",
                    }]}>
                      {career.demand}
                    </Text>
                  </View>
                  <Text style={[styles.careerSub, { color: colors.textMuted }]}>{career.subtitle}</Text>
                  <View style={styles.salaryRow}>
                    <Feather name="dollar-sign" size={11} color={colors.textMuted} />
                    <Text style={[styles.salaryText, { color: colors.textMuted }]}>{career.salary} / yr</Text>
                    <Text style={[styles.dot, { color: colors.textMuted }]}>·</Text>
                    <Text style={[styles.salaryText, { color: colors.textMuted }]}>
                      {career.requiredCourses.length} courses required
                    </Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textMuted} />
              </View>
              {!isLast && <View style={[styles.rowDivider, { backgroundColor: colors.separator, marginLeft: 68 }]} />}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  screenTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  screenSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 8 },
  list: { paddingHorizontal: 20 },
  careerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  careerInfo: { flex: 1, gap: 3 },
  careerTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  careerTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  demandBadge: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  careerSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  salaryRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 1 },
  salaryText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 11 },
  rowDivider: { height: 1 },
});
