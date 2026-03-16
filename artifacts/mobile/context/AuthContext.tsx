import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useEffect, useCallback } from "react";
import * as Crypto from "expo-crypto";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google";
  createdAt: string;
}

const AUTH_KEY = "auth_user";
const USERS_KEY = "registered_users";

type RegisteredUser = AuthUser & { passwordHash: string };

async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + "techjourney_salt_v1"
  );
}

const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (u: AuthUser) => {
    setUser(u);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(u));
  };

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    const stored = await AsyncStorage.getItem(USERS_KEY);
    const users: RegisteredUser[] = stored ? JSON.parse(stored) : [];

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError("An account with this email already exists.");
      return false;
    }

    const passwordHash = await hashPassword(password);
    const newUser: RegisteredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      provider: "email",
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { passwordHash: _, ...sessionUser } = newUser;
    await saveSession(sessionUser);
    return true;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return false;
    }

    const stored = await AsyncStorage.getItem(USERS_KEY);
    const users: RegisteredUser[] = stored ? JSON.parse(stored) : [];

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) {
      setError("No account found with this email.");
      return false;
    }

    const passwordHash = await hashPassword(password);
    if (found.passwordHash !== passwordHash) {
      setError("Incorrect password.");
      return false;
    }

    const { passwordHash: _, ...sessionUser } = found;
    await saveSession(sessionUser);
    return true;
  }, []);

  const loginWithGoogle = useCallback(async (googleUser: { name: string; email: string; avatar?: string }) => {
    setError(null);
    const stored = await AsyncStorage.getItem(USERS_KEY);
    const users: RegisteredUser[] = stored ? JSON.parse(stored) : [];

    let existing = users.find((u) => u.email.toLowerCase() === googleUser.email.toLowerCase());

    if (!existing) {
      existing = {
        id: `google_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        avatar: googleUser.avatar,
        provider: "google",
        createdAt: new Date().toISOString(),
        passwordHash: "",
      };
      users.push(existing);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const { passwordHash: _, ...sessionUser } = existing;
    await saveSession(sessionUser);
    return true;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { user, loading, error, register, login, loginWithGoogle, logout, clearError };
});

export { AuthProvider, useAuth };
