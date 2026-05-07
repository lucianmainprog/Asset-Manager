import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useEffect, useCallback } from "react";

export interface SubscriptionPlan {
  isPremium: boolean;
  startDate: string | null;
  renewalDate: string | null;
  trialUsed: boolean;
}

const INITIAL_PLAN: SubscriptionPlan = {
  isPremium: false,
  startDate: null,
  renewalDate: null,
  trialUsed: false,
};

const SUB_KEY = "subscription_plan";

const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const [plan, setPlan] = useState<SubscriptionPlan>(INITIAL_PLAN);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SUB_KEY).then((data) => {
      if (data) setPlan(JSON.parse(data));
      setLoaded(true);
    });
  }, []);

  const savePlan = useCallback(async (p: SubscriptionPlan) => {
    setPlan(p);
    await AsyncStorage.setItem(SUB_KEY, JSON.stringify(p));
  }, []);

  const subscribe = useCallback(async () => {
    const now = new Date();
    const renewal = new Date(now);
    renewal.setMonth(renewal.getMonth() + 1);
    await savePlan({
      isPremium: true,
      startDate: now.toISOString(),
      renewalDate: renewal.toISOString(),
      trialUsed: true,
    });
  }, [savePlan]);

  const cancelSubscription = useCallback(async () => {
    await savePlan({ ...plan, isPremium: false });
  }, [plan, savePlan]);

  const renewalDateFormatted = plan.renewalDate
    ? new Date(plan.renewalDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return { plan, loaded, subscribe, cancelSubscription, isPremium: plan.isPremium, renewalDateFormatted };
});

export { SubscriptionProvider, useSubscription };
