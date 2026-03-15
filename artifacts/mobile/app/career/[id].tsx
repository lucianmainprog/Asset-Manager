import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Colors from "@/constants/colors";

const CAREERS: Record<string, any> = {
  networking: {
    id: "networking",
    title: "Networking",
    subtitle: "Build the backbone of the internet",
    icon: "wifi",
    color: "#3B82F6",
    salary: "$65k – $120k",
    demand: "High",
    description: "Network engineers design, implement, and manage computer networks that form the backbone of the internet and corporate infrastructure. They ensure data flows reliably and securely across local and wide area networks.",
    skills: ["TCP/IP", "Cisco IOS", "Subnetting", "DNS", "DHCP", "VLANs", "BGP", "OSPF", "Firewalls", "VPNs"],
    certifications: ["CCNA", "CompTIA Network+", "CCNP", "Juniper JNCIA"],
    roles: [
      { title: "Network Engineer", level: "Mid", salary: "$80k–$110k" },
      { title: "Network Admin", level: "Entry", salary: "$55k–$75k" },
      { title: "NOC Technician", level: "Entry", salary: "$45k–$65k" },
      { title: "Network Architect", level: "Senior", salary: "$120k–$160k" },
    ],
    tools: ["Cisco Packet Tracer", "Wireshark", "GNS3", "PuTTY", "SolarWinds"],
    roadmap: ["Learn networking fundamentals", "Study TCP/IP stack", "Get CompTIA Network+", "Learn Cisco IOS", "Earn CCNA", "Practice with labs"],
  },
  cybersecurity: {
    id: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Protect systems from threats",
    icon: "shield",
    color: "#EF4444",
    salary: "$80k – $150k",
    demand: "Very High",
    description: "Cybersecurity professionals protect organizations from digital threats, breaches, and attacks. This high-demand field offers diverse roles from ethical hacking to policy development.",
    skills: ["Penetration Testing", "SIEM", "Incident Response", "Cryptography", "Threat Intelligence", "Forensics", "Firewalls", "IDS/IPS"],
    certifications: ["CompTIA Security+", "CEH", "CISSP", "CISM", "OSCP"],
    roles: [
      { title: "Security Analyst", level: "Entry", salary: "$65k–$95k" },
      { title: "Penetration Tester", level: "Mid", salary: "$90k–$140k" },
      { title: "SOC Analyst", level: "Entry", salary: "$55k–$80k" },
      { title: "CISO", level: "Executive", salary: "$150k–$300k" },
    ],
    tools: ["Metasploit", "Wireshark", "Burp Suite", "Nmap", "Splunk"],
    roadmap: ["Learn networking basics", "Study OS security", "Get CompTIA Security+", "Learn ethical hacking", "Earn CEH or OSCP", "Build a lab environment"],
  },
  software: {
    id: "software",
    title: "Software Development",
    subtitle: "Build software that powers the world",
    icon: "code",
    color: "#10B981",
    salary: "$85k – $180k",
    demand: "Very High",
    description: "Software developers design, code, test, and maintain applications. From mobile apps to cloud services, developers are behind every digital experience we use daily.",
    skills: ["JavaScript", "Python", "React", "Node.js", "Git", "APIs", "Databases", "Testing", "CI/CD", "System Design"],
    certifications: ["AWS Developer", "Azure Developer", "Oracle Java", "Google Associate Android Developer"],
    roles: [
      { title: "Frontend Developer", level: "Mid", salary: "$80k–$130k" },
      { title: "Backend Developer", level: "Mid", salary: "$90k–$145k" },
      { title: "Full Stack Engineer", level: "Mid", salary: "$95k–$160k" },
      { title: "Software Architect", level: "Senior", salary: "$150k–$200k" },
    ],
    tools: ["VS Code", "GitHub", "Docker", "Postman", "Jira"],
    roadmap: ["Learn HTML, CSS, JavaScript", "Pick a framework (React/Vue)", "Learn backend (Node.js/Python)", "Study databases", "Build projects", "Contribute to open source"],
  },
  cloud: {
    id: "cloud",
    title: "Cloud Engineering",
    subtitle: "Design scalable cloud infrastructure",
    icon: "cloud",
    color: "#F59E0B",
    salary: "$95k – $180k",
    demand: "Very High",
    description: "Cloud engineers design, build, and maintain cloud infrastructure. They leverage platforms like AWS, Azure, and GCP to create scalable, reliable, and cost-effective solutions.",
    skills: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Docker", "Networking", "Security", "Monitoring", "Cost Optimization"],
    certifications: ["AWS Solutions Architect", "Azure Administrator", "GCP Associate", "CKA", "Terraform Associate"],
    roles: [
      { title: "Cloud Engineer", level: "Mid", salary: "$100k–$145k" },
      { title: "Cloud Architect", level: "Senior", salary: "$140k–$200k" },
      { title: "DevOps Engineer", level: "Mid", salary: "$110k–$160k" },
      { title: "FinOps Engineer", level: "Mid", salary: "$115k–$155k" },
    ],
    tools: ["AWS Console", "Terraform", "kubectl", "CloudFormation", "Grafana"],
    roadmap: ["Learn cloud fundamentals", "Choose a platform (AWS/Azure/GCP)", "Get foundational cert", "Learn IaC with Terraform", "Study Kubernetes", "Earn associate-level cert"],
  },
  devops: {
    id: "devops",
    title: "DevOps",
    subtitle: "Bridge development and operations",
    icon: "refresh-cw",
    color: "#8B5CF6",
    salary: "$90k – $170k",
    demand: "High",
    description: "DevOps engineers streamline software delivery by bridging development and operations teams. They automate pipelines, manage infrastructure, and ensure fast, reliable deployments.",
    skills: ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Ansible", "Git", "Python/Bash", "Monitoring", "Cloud Platforms", "Security"],
    certifications: ["AWS DevOps", "CKA", "HashiCorp Terraform", "Jenkins Certification"],
    roles: [
      { title: "DevOps Engineer", level: "Mid", salary: "$105k–$155k" },
      { title: "SRE", level: "Senior", salary: "$130k–$190k" },
      { title: "Platform Engineer", level: "Mid", salary: "$115k–$160k" },
      { title: "Release Manager", level: "Mid", salary: "$95k–$140k" },
    ],
    tools: ["Jenkins", "GitLab CI", "Ansible", "Prometheus", "ELK Stack"],
    roadmap: ["Learn Linux fundamentals", "Master Git", "Learn Docker and containers", "Study CI/CD pipelines", "Learn Kubernetes", "Master monitoring with Prometheus/Grafana"],
  },
  datascience: {
    id: "datascience",
    title: "Data Science",
    subtitle: "Turn data into insights",
    icon: "bar-chart-2",
    color: "#EC4899",
    salary: "$90k – $175k",
    demand: "High",
    description: "Data scientists extract insights from large datasets using statistical analysis, machine learning, and data visualization. They help organizations make data-driven decisions.",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Tableau", "Statistics", "R", "Big Data", "NLP", "Deep Learning"],
    certifications: ["AWS Data Analytics", "Google Data Analytics", "IBM Data Science", "TensorFlow Developer"],
    roles: [
      { title: "Data Analyst", level: "Entry", salary: "$65k–$95k" },
      { title: "Data Scientist", level: "Mid", salary: "$100k–$155k" },
      { title: "ML Engineer", level: "Mid", salary: "$120k–$175k" },
      { title: "Data Engineering", level: "Mid", salary: "$110k–$160k" },
    ],
    tools: ["Jupyter", "Pandas", "Scikit-learn", "TensorFlow", "Power BI"],
    roadmap: ["Learn Python programming", "Master statistics and math", "Learn SQL and databases", "Study machine learning basics", "Build ML projects", "Specialize in a domain"],
  },
};

export default function CareerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const career = CAREERS[id as string];

  if (!career) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Career not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroSection, { backgroundColor: career.color + "18" }]}>
        <View style={[styles.heroIcon, { backgroundColor: career.color + "33" }]}>
          <Feather name={career.icon} size={36} color={career.color} />
        </View>
        <Text style={[styles.heroTitle, { color: colors.text }]}>{career.title}</Text>
        <Text style={[styles.heroSub, { color: colors.textSecondary }]}>{career.subtitle}</Text>
        <View style={styles.heroStats}>
          <View style={[styles.heroBadge, { backgroundColor: colors.backgroundSecondary }]}>
            <Feather name="dollar-sign" size={14} color="#10B981" />
            <Text style={[styles.heroBadgeText, { color: colors.text }]}>{career.salary}</Text>
          </View>
          <View
            style={[
              styles.heroBadge,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <Feather name="trending-up" size={14} color={career.demand === "Very High" ? "#10B981" : "#F59E0B"} />
            <Text style={[styles.heroBadgeText, { color: colors.text }]}>{career.demand} demand</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {career.description}
        </Text>

        <Section title="Career Roles" colors={colors}>
          {career.roles.map((role: any) => (
            <View key={role.title} style={[styles.roleCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.roleInfo}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>{role.title}</Text>
                <View style={[styles.levelBadge, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={[styles.levelText, { color: colors.textSecondary }]}>{role.level}</Text>
                </View>
              </View>
              <Text style={[styles.roleSalary, { color: "#10B981" }]}>{role.salary}</Text>
            </View>
          ))}
        </Section>

        <Section title="Required Skills" colors={colors}>
          <View style={styles.chipGrid}>
            {career.skills.map((skill: string) => (
              <View key={skill} style={[styles.chip, { backgroundColor: career.color + "22", borderColor: career.color + "44" }]}>
                <Text style={[styles.chipText, { color: career.color }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Certifications" colors={colors}>
          {career.certifications.map((cert: string, idx: number) => (
            <View key={cert} style={[styles.certRow, { borderBottomColor: colors.cardBorder }]}>
              <View style={[styles.certNum, { backgroundColor: colors.backgroundTertiary }]}>
                <Text style={[styles.certNumText, { color: colors.textSecondary }]}>{idx + 1}</Text>
              </View>
              <Text style={[styles.certName, { color: colors.text }]}>{cert}</Text>
              <Feather name="chevron-right" size={16} color={colors.textMuted} />
            </View>
          ))}
        </Section>

        <Section title="Key Tools" colors={colors}>
          <View style={styles.chipGrid}>
            {career.tools.map((tool: string) => (
              <View key={tool} style={[styles.chip, { backgroundColor: colors.backgroundTertiary }]}>
                <Text style={[styles.chipText, { color: colors.textSecondary }]}>{tool}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Learning Roadmap" colors={colors}>
          {career.roadmap.map((step: string, idx: number) => (
            <View key={step} style={styles.roadmapStep}>
              <View style={[styles.stepDot, { backgroundColor: career.color }]}>
                <Text style={styles.stepNum}>{idx + 1}</Text>
              </View>
              {idx < career.roadmap.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: career.color + "44" }]} />
              )}
              <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
            </View>
          ))}
        </Section>
      </View>
    </ScrollView>
  );
}

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
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
  heroSection: {
    alignItems: "center",
    padding: 28,
    gap: 8,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  heroSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  heroBadgeText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  content: {
    padding: 20,
    gap: 24,
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  roleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roleTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  levelBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  roleSalary: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  certRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  certNum: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  certNumText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  certName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  roadmapStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    position: "relative",
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  stepLine: {
    position: "absolute",
    left: 14,
    top: 28,
    width: 2,
    height: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    paddingTop: 4,
  },
});
