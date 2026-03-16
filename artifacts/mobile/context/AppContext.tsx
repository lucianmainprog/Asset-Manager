import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useEffect, useCallback } from "react";
import { LESSON_DATA } from "@/data/lessonData";
import { NETWORKING_LESSONS } from "@/data/networkingLessons";
import { CYBERSECURITY_LESSONS } from "@/data/cybersecurityLessons";

const ALL_LESSONS: Record<string, import("@/data/lessonData").LessonItem[]> = {
  ...LESSON_DATA,
  networking: NETWORKING_LESSONS,
  cybersecurity: CYBERSECURITY_LESSONS,
};

export interface Course {
  id: string;
  title: string;
  language: string;
  category: "programming" | "career" | "certification";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  totalLessons: number;
  completedLessons: number;
  xpReward: number;
  icon: string;
  color: string;
  description: string;
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
  { id: "html", title: "HTML", language: "HTML", category: "programming", difficulty: "Beginner", totalLessons: LESSON_DATA.html?.length ?? 15, completedLessons: 0, xpReward: 50, icon: "code", color: "#E34F26", description: "Build the structure of web pages with semantic HTML" },
  { id: "css", title: "CSS", language: "CSS", category: "programming", difficulty: "Beginner", totalLessons: LESSON_DATA.css?.length ?? 14, completedLessons: 0, xpReward: 50, icon: "layers", color: "#1572B6", description: "Style your web pages with modern CSS techniques" },
  { id: "javascript", title: "JavaScript", language: "JavaScript", category: "programming", difficulty: "Intermediate", totalLessons: LESSON_DATA.javascript?.length ?? 15, completedLessons: 0, xpReward: 75, icon: "zap", color: "#CA8A04", description: "Make your websites interactive with JavaScript" },
  { id: "python", title: "Python", language: "Python", category: "programming", difficulty: "Beginner", totalLessons: LESSON_DATA.python?.length ?? 15, completedLessons: 0, xpReward: 75, icon: "terminal", color: "#3776AB", description: "Learn the most versatile programming language" },
  { id: "csharp", title: "C#", language: "C#", category: "programming", difficulty: "Intermediate", totalLessons: LESSON_DATA.csharp?.length ?? 12, completedLessons: 0, xpReward: 100, icon: "cpu", color: "#9B4993", description: "Build enterprise applications with Microsoft's language" },
  { id: "cpp", title: "C++", language: "C++", category: "programming", difficulty: "Advanced", totalLessons: LESSON_DATA.cpp?.length ?? 13, completedLessons: 0, xpReward: 100, icon: "activity", color: "#00599C", description: "Master systems programming with C++" },
  { id: "networking", title: "Networking (CCNA)", language: "Networking", category: "certification", difficulty: "Intermediate", totalLessons: NETWORKING_LESSONS.length, completedLessons: 0, xpReward: 100, icon: "wifi", color: "#3B82F6", description: "CCNA-level networking: OSI, subnetting, routing, switching, VPNs" },
  { id: "cybersecurity", title: "Cybersecurity (Sec+)", language: "Cybersecurity", category: "certification", difficulty: "Intermediate", totalLessons: CYBERSECURITY_LESSONS.length, completedLessons: 0, xpReward: 125, icon: "shield", color: "#EF4444", description: "Security+ and CEH-level: threats, crypto, pentesting, incident response" },
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
      const [profileData, challengesData, achievementsData] = await Promise.all([
        AsyncStorage.getItem("profile"),
        AsyncStorage.getItem("challenges"),
        AsyncStorage.getItem("achievements"),
      ]);
      let savedProfile: UserProfile | null = null;
      if (profileData) { savedProfile = JSON.parse(profileData); setProfile(savedProfile!); }
      if (challengesData) setChallenges(JSON.parse(challengesData));
      if (achievementsData) setAchievements(JSON.parse(achievementsData));

      if (savedProfile) {
        const completedSet = new Set(savedProfile.completedLessons);
        const updatedCourses = COURSES.map((course) => {
          const courseLessons = ALL_LESSONS[course.id] || [];
          const completed = courseLessons.filter((l) => completedSet.has(l.id)).length;
          return { ...course, completedLessons: completed };
        });
        setCourses(updatedCourses);
      }
    } catch (e) { console.warn("Failed to load data", e); } finally { setLoaded(true); }
  };

  const saveProfile = useCallback(async (p: UserProfile) => {
    setProfile(p);
    await AsyncStorage.setItem("profile", JSON.stringify(p));
  }, []);

  const saveChallenges = useCallback(async (c: Challenge[]) => {
    setChallenges(c);
    await AsyncStorage.setItem("challenges", JSON.stringify(c));
  }, []);

  const addXP = useCallback(async (amount: number) => {
    setProfile((prev) => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      while (newXP >= xpForLevel(newLevel)) newLevel++;
      const updated = { ...prev, xp: newXP, level: newLevel };
      AsyncStorage.setItem("profile", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeLesson = useCallback(
    async (lessonId: string, courseId: string, xp: number) => {
      const alreadyDone = profile.completedLessons.includes(lessonId);
      const newCompletedLessons = alreadyDone ? profile.completedLessons : [...profile.completedLessons, lessonId];
      const newXP = alreadyDone ? profile.xp : profile.xp + xp;
      let newLevel = profile.level;
      while (newXP >= xpForLevel(newLevel)) newLevel++;
      const newProfile: UserProfile = { ...profile, completedLessons: newCompletedLessons, xp: newXP, level: newLevel };
      await saveProfile(newProfile);

      const completedSet = new Set(newCompletedLessons);
      const updatedCourses = COURSES.map((course) => {
        const courseLessons = ALL_LESSONS[course.id] || [];
        const completed = courseLessons.filter((l) => completedSet.has(l.id)).length;
        return { ...course, completedLessons: completed };
      });
      setCourses(updatedCourses);
    },
    [profile, saveProfile]
  );

  const completeChallenge = useCallback(
    async (challengeId: string, xp: number) => {
      const newChallenges = challenges.map((c) => c.id === challengeId ? { ...c, completed: true } : c);
      await saveChallenges(newChallenges);
      const newXP = profile.xp + xp;
      let newLevel = profile.level;
      while (newXP >= xpForLevel(newLevel)) newLevel++;
      const newProfile: UserProfile = {
        ...profile,
        completedChallenges: profile.completedChallenges.includes(challengeId) ? profile.completedChallenges : [...profile.completedChallenges, challengeId],
        xp: newXP, level: newLevel,
      };
      await saveProfile(newProfile);
    },
    [profile, challenges, saveProfile, saveChallenges]
  );

  const updateName = useCallback(async (name: string) => { await saveProfile({ ...profile, name }); }, [profile, saveProfile]);

  const xpToNextLevel = xpForLevel(profile.level);
  const xpProgress = Math.min(profile.xp / xpToNextLevel, 1);
  const activeCourses = courses.filter((c) => c.completedLessons > 0);
  const completedChallengesCount = challenges.filter((c) => c.completed).length;

  return { profile, courses, challenges, achievements, loaded, addXP, completeLesson, completeChallenge, updateName, xpToNextLevel, xpProgress, activeCourses, completedChallengesCount, ALL_LESSONS };
});

export { AppProvider, useApp };
