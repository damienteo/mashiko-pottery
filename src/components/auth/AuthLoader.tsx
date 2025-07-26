"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchSupabaseUser } from "@/store/authSlice";

export default function AuthLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSupabaseUser());
  }, [dispatch]);

  return null;
}
