"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSupabaseUser, selectCurrentUser } from "@/store/user/authSlice";
import { supabase } from "@/lib/supabase/client";

export default function AuthLoader() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const tried = useRef(false);

  useEffect(() => {
    if (!user && !tried.current) {
      dispatch(fetchSupabaseUser());
      // Only fetch once to avoid infinite loop
      tried.current = true;
    }
  }, [dispatch, user]);

  // Subscribe to auth state changes
  // This will ensure the user state across tabs is updated on login/logout
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      dispatch(fetchSupabaseUser());
    });
    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
}
