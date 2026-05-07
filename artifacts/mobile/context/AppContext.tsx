import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useEffect, useCallback } from "react";
import { LESSON_DATA, LessonItem } from "@/data/lessonData";
import { NETWORKING_LESSONS } from "@/data/networkingLessons";
import { CYBERSECURITY_LESSONS } from "@/data/cybersecurityLessons";
import { CLOUD_LESSONS } from "@/data/cloudLessons";
import { DEVOPS_LESSONS } from "@/data/devopsLessons";
import { ML_LESSONS } from "@/data/mlLessons";

const ALL_LESSONS: Record<string, LessonItem[]> = {
  ...LESSON_DATA,
  networking: NETWORKING_LESSONS,
  cybersecurity: CYBERSECURITY_LESSONS,
  cloud: CLOUD_LESSONS,
  devops: DEVOPS_LESSONS,
  ml: ML_LESSONS,
};

export interface Course {
  id: string;
  title: string;
  language: string;
  category: "programming" | "certification" | "cloud" | "ml";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  totalLessons: number;
  completedLessons: number;
  xpReward: number;
  icon: string;
  color: string;
  description: string;
  isPremium?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  language: string;
  xpReward: number;
  completed: boolean;
  starterCode: string;
  hint: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpReward: number;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedChallenges: string[];
  achievements: string[];
}

const INITIAL_PROFILE: UserProfile = {
  name: "Learner",
  xp: 0,
  level: 1,
  streak: 1,
  lastActiveDate: new Date().toDateString(),
  completedLessons: [],
  completedChallenges: [],
  achievements: [],
};

export const COURSES: Course[] = [
  // FREE
  { id: "html", title: "HTML", language: "HTML", category: "programming", difficulty: "Beginner", totalLessons: LESSON_DATA.html?.length ?? 15, completedLessons: 0, xpReward: 50, icon: "code", color: "#E34F26", description: "Build the structure of web pages with semantic HTML5", isPremium: false },
  { id: "css", title: "CSS", language: "CSS", category: "programming", difficulty: "Beginner", totalLessons: LESSON_DATA.css?.length ?? 14, completedLessons: 0, xpReward: 50, icon: "layers", color: "#1572B6", description: "Style and layout with modern CSS — flexbox, grid, animations", isPremium: false },
  { id: "javascript", title: "JavaScript", language: "JavaScript", category: "programming", difficulty: "Intermediate", totalLessons: LESSON_DATA.javascript?.length ?? 15, completedLessons: 0, xpReward: 75, icon: "zap", color: "#CA8A04", description: "Make websites interactive — DOM, async, ES6+, APIs", isPremium: false },
  { id: "python", title: "Python", language: "Python", category: "programming", difficulty: "Beginner", totalLessons: LESSON_DATA.python?.length ?? 15, completedLessons: 0, xpReward: 75, icon: "terminal", color: "#3776AB", description: "The most versatile language — scripting, web, data, automation", isPremium: false },
  { id: "csharp", title: "C#", language: "C#", category: "programming", difficulty: "Intermediate", totalLessons: LESSON_DATA.csharp?.length ?? 12, completedLessons: 0, xpReward: 100, icon: "cpu", color: "#9B4993", description: "Enterprise applications and games with Microsoft's .NET ecosystem", isPremium: false },
  { id: "cpp", title: "C++", language: "C++", category: "programming", difficulty: "Advanced", totalLessons: LESSON_DATA.cpp?.length ?? 13, completedLessons: 0, xpReward: 100, icon: "activity", color: "#00599C", description: "Systems programming, performance-critical apps, competitive coding", isPremium: false },
  // PREMIUM
  { id: "networking", title: "Networking (CCNA)", language: "Networking", category: "certification", difficulty: "Intermediate", totalLessons: NETWORKING_LESSONS.length, completedLessons: 0, xpReward: 100, icon: "wifi", color: "#3B82F6", description: "CCNA-level: OSI, subnetting, OSPF, BGP, VLANs, VPNs, SDN", isPremium: true },
  { id: "cybersecurity", title: "Cybersecurity (Sec+)", language: "Security", category: "certification", difficulty: "Intermediate", totalLessons: CYBERSECURITY_LESSONS.length, completedLessons: 0, xpReward: 125, icon: "shield", color: "#EF4444", description: "Security+ & CEH: threats, crypto, pentesting, malware, APTs", isPremium: true },
  { id: "cloud", title: "Cloud Computing (AWS)", language: "Cloud", category: "cloud", difficulty: "Intermediate", totalLessons: CLOUD_LESSONS.length, completedLessons: 0, xpReward: 125, icon: "cloud", color: "#FF9900", description: "AWS from scratch: EC2, S3, VPC, Lambda, EKS, IaC, cost optimization", isPremium: true },
  { id: "devops", title: "DevOps & Docker", language: "DevOps", category: "cloud", difficulty: "Intermediate", totalLessons: DEVOPS_LESSONS.length, completedLessons: 0, xpReward: 125, icon: "box", color: "#2496ED", description: "Docker, Kubernetes, CI/CD pipelines, GitOps, SRE, DevSecOps", isPremium: true },
  { id: "ml", title: "Machine Learning & AI", language: "Python/ML", category: "ml", difficulty: "Advanced", totalLessons: ML_LESSONS.length, completedLessons: 0, xpReward: 150, icon: "cpu", color: "#7C3AED", description: "NumPy, PyTorch, CNNs, NLP, LLMs, RAG pipelines, MLOps deployment", isPremium: true },
];

export const CHALLENGES: Challenge[] = [
  { id: "ch1", title: "Reverse a String", difficulty: "Beginner", description: "Write a function that reverses a string without using built-in reverse methods.", language: "JavaScript", xpReward: 100, completed: false, starterCode: "function reverseString(str) {\n  // Your code here\n  \n}", hint: "Try iterating backwards through the string characters" },
  { id: "ch2", title: "Palindrome Check", difficulty: "Beginner", description: "Check if a given string is a palindrome (reads the same forwards and backwards).", language: "Python", xpReward: 100, completed: false, starterCode: "def is_palindrome(s):\n    # Your code here\n    pass", hint: "Compare the string with its reversed version" },
  { id: "ch3", title: "Find Prime Numbers", difficulty: "Intermediate", description: "Write a function that returns all prime numbers up to a given number n.", language: "JavaScript", xpReward: 150, completed: false, starterCode: "function findPrimes(n) {\n  // Your code here\n  \n}", hint: "A number is prime if it has no divisors other than 1 and itself" },
  { id: "ch4", title: "FizzBuzz", difficulty: "Beginner", description: "Print numbers 1-100, but 'Fizz' for multiples of 3, 'Buzz' for 5, and 'FizzBuzz' for both.", language: "Python", xpReward: 75, completed: false, starterCode: "def fizzbuzz():\n    # Your code here\n    pass", hint: "Use the modulo (%) operator to check divisibility" },
  { id: "ch5", title: "Binary Search", difficulty: "Intermediate", description: "Implement binary search algorithm to find an element in a sorted array.", language: "JavaScript", xpReward: 150, completed: false, starterCode: "function binarySearch(arr, target) {\n  // Your code here\n  \n}", hint: "Divide the search space in half with each comparison" },
  { id: "ch6", title: "Fibonacci Sequence", difficulty: "Intermediate", description: "Generate the first n numbers of the Fibonacci sequence efficiently.", language: "Python", xpReward: 150, completed: false, starterCode: "def fibonacci(n):\n    # Your code here\n    pass", hint: "Each number is the sum of the two preceding ones" },
  { id: "ch7", title: "Merge Sort", difficulty: "Advanced", description: "Implement the merge sort algorithm for sorting an array.", language: "JavaScript", xpReward: 200, completed: false, starterCode: "function mergeSort(arr) {\n  // Your code here\n  \n}", hint: "Divide the array in half, sort each half, then merge" },
  { id: "ch8", title: "Two Sum Problem", difficulty: "Intermediate", description: "Find two numbers in an array that add up to a target sum. Return their indices.", language: "Python", xpReward: 150, completed: false, starterCode: "def two_sum(nums, target):\n    # Your code here\n    pass", hint: "Use a dictionary to store complements" },
  { id: "ch9", title: "Subnet Calculator", difficulty: "Intermediate", description: "Given an IP address and prefix length, calculate the network address, broadcast address, and number of usable hosts.", language: "Python", xpReward: 150, completed: false, starterCode: "def subnet_calc(ip, prefix):\n    # ip = '192.168.1.100', prefix = 24\n    # Return network, broadcast, and num_hosts\n    pass", hint: "Convert IP to binary, apply the subnet mask, then convert back" },
  { id: "ch10", title: "Caesar Cipher", difficulty: "Beginner", description: "Implement a Caesar cipher that encrypts and decrypts a message using a given shift value.", language: "Python", xpReward: 100, completed: false, starterCode: "def caesar_cipher(text, shift, encrypt=True):\n    # Your code here\n    pass", hint: "Use modulo arithmetic to wrap around the alphabet" },
  { id: "ch11", title: "Valid Parentheses", difficulty: "Intermediate", description: "Given a string of brackets (), [], {}, determine if the brackets are valid and balanced.", language: "JavaScript", xpReward: 150, completed: false, starterCode: "function isValid(s) {\n  // Use a stack\n  \n}", hint: "Use a stack: push opening brackets, pop and match closing ones" },
  { id: "ch12", title: "Linked List Reversal", difficulty: "Advanced", description: "Reverse a singly linked list without using extra space (in-place).", language: "Python", xpReward: 200, completed: false, starterCode: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    # Your code here\n    pass", hint: "Use three pointers: prev, curr, and next" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_lesson", title: "First Steps", description: "Complete your first lesson", icon: "star", unlocked: false, xpReward: 50 },
  { id: "streak_7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "zap", unlocked: false, xpReward: 100 },
  { id: "xp_500", title: "XP Hunter", description: "Earn 500 XP", icon: "award", unlocked: false, xpReward: 50 },
  { id: "first_challenge", title: "Code Challenger", description: "Complete your first challenge", icon: "code", unlocked: false, xpReward: 75 },
  { id: "courses_3", title: "Multi-Learner", description: "Start 3 different courses", icon: "book-open", unlocked: false, xpReward: 100 },
  { id: "xp_1000", title: "XP Master", description: "Earn 1000 XP", icon: "trending-up", unlocked: false, xpReward: 150 },
  { id: "net_complete", title: "Network Engineer", description: "Complete the Networking course", icon: "wifi", unlocked: false, xpReward: 200 },
  { id: "sec_complete", title: "Security Analyst", description: "Complete the Cybersecurity course", icon: "shield", unlocked: false, xpReward: 200 },
  { id: "cloud_complete", title: "Cloud Architect", description: "Complete the Cloud Computing course", icon: "cloud", unlocked: false, xpReward: 250 },
  { id: "devops_complete", title: "DevOps Engineer", description: "Complete the DevOps & Docker course", icon: "box", unlocked: false, xpReward: 250 },
  { id: "ml_complete", title: "ML Engineer", description: "Complete the Machine Learning course", icon: "cpu", unlocked: false, xpReward: 300 },
];

function xpForLevel(level: number): number {
  return level * 200;
}

const [AppProvider, useApp] = createContextHook(() => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [profileData, challengesData] = await Promise.all([
        AsyncStorage.getItem("profile"),
        AsyncStorage.getItem("challenges"),
      ]);
      let savedProfile: UserProfile | null = null;
      if (profileData) { savedProfile = JSON.parse(profileData); setProfile(savedProfile!); }
      if (challengesData) setChallenges(JSON.parse(challengesData));

      if (savedProfile) {
        const completedSet = new Set(savedProfile.completedLessons);
        const updatedCourses = COURSES.map((course) => {
          const lessons = ALL_LESSONS[course.id] || [];
          const completed = lessons.filter((l) => completedSet.has(l.id)).length;
          return { ...course, completedLessons: completed };
        });
        setCourses(updatedCourses);
      }
    } catch (e) {
      console.warn("Failed to load data", e);
    } finally {
      setLoaded(true);
    }
  };

  const saveProfile = useCallback(async (p: UserProfile) => {
    setProfile(p);
    await AsyncStorage.setItem("profile", JSON.stringify(p));
  }, []);

  const saveChallenges = useCallback(async (c: Challenge[]) => {
    setChallenges(c);
    await AsyncStorage.setItem("challenges", JSON.stringify(c));
  }, []);

  const completeLesson = useCallback(
    async (lessonId: string, courseId: string, xp: number) => {
      const alreadyDone = profile.completedLessons.includes(lessonId);
      const newCompletedLessons = alreadyDone
        ? profile.completedLessons
        : [...profile.completedLessons, lessonId];
      const newXP = alreadyDone ? profile.xp : profile.xp + xp;
      let newLevel = profile.level;
      while (newXP >= xpForLevel(newLevel)) newLevel++;
      const newProfile: UserProfile = {
        ...profile,
        completedLessons: newCompletedLessons,
        xp: newXP,
        level: newLevel,
      };
      await saveProfile(newProfile);
      const completedSet = new Set(newCompletedLessons);
      const updatedCourses = COURSES.map((course) => {
        const lessons = ALL_LESSONS[course.id] || [];
        const completed = lessons.filter((l) => completedSet.has(l.id)).length;
        return { ...course, completedLessons: completed };
      });
      setCourses(updatedCourses);
    },
    [profile, saveProfile]
  );

  const completeChallenge = useCallback(
    async (challengeId: string, xp: number) => {
      const newChallenges = challenges.map((c) =>
        c.id === challengeId ? { ...c, completed: true } : c
      );
      await saveChallenges(newChallenges);
      const newXP = profile.xp + xp;
      let newLevel = profile.level;
      while (newXP >= xpForLevel(newLevel)) newLevel++;
      const newProfile: UserProfile = {
        ...profile,
        completedChallenges: profile.completedChallenges.includes(challengeId)
          ? profile.completedChallenges
          : [...profile.completedChallenges, challengeId],
        xp: newXP,
        level: newLevel,
      };
      await saveProfile(newProfile);
    },
    [profile, challenges, saveProfile, saveChallenges]
  );

  const updateName = useCallback(
    async (name: string) => { await saveProfile({ ...profile, name }); },
    [profile, saveProfile]
  );

  const xpToNextLevel = xpForLevel(profile.level);
  const xpProgress = Math.min(profile.xp / xpToNextLevel, 1);
  const activeCourses = courses.filter((c) => c.completedLessons > 0);
  const completedChallengesCount = challenges.filter((c) => c.completed).length;

  return {
    profile,
    courses,
    challenges,
    achievements,
    loaded,
    completeLesson,
    completeChallenge,
    updateName,
    xpToNextLevel,
    xpProgress,
    activeCourses,
    completedChallengesCount,
    ALL_LESSONS,
  };
});

export { AppProvider, useApp };
