"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSupabaseUser, selectCurrentUser } from "@/store/user/authSlice";

export default function AuthLoader() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const tried = useRef(false);

  useEffect(() => {
    if (!user && !tried.current) {
      dispatch(fetchSupabaseUser());
      tried.current = true;
    }
  }, [dispatch, user]);

  return null;
}
