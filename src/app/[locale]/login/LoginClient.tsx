"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/authSlice";
import {
  loadCartFromStorage,
  clearCartFromStorage,
} from "@/store/localStorage";
import { mergeCart, fetchCart } from "@/store/cartSlice";

import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

interface Props {
  callback: string;
}

export default function LoginClient({ callback }: Props) {
  const t = useTranslations("common");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, error: toastError } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Dispatch login thunk (which returns user on success)
      const resultAction = await dispatch(login({ email: username, password }));
      if (login.fulfilled.match(resultAction)) {
        // Successful login
        success(t("login.success"));
        // Merge guest cart if present
        const guestItems = loadCartFromStorage();
        if (guestItems.length > 0) {
          await dispatch(mergeCart(guestItems));
          clearCartFromStorage();
        }
        // Refresh cart from server
        await dispatch(fetchCart());
        router.push(callback);
      } else {
        // Thunk was rejected—will be handled by slice
        throw new Error("Login failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(t("login.error"));
        toastError(t("login.error"));
      } else {
        setError(t("login.unknownError"));
        toastError(t("login.unknownError"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">{t("login.title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
        {error && <p className="text-red-600">{error}</p>}
        <div>
          <label className="block mb-1">{t("login.username")}</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block mb-1">{t("login.password")}</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t("login.loading") : t("login.submit")}
        </Button>

        <Button
          type="button"
          disabled={loading}
          className="w-full"
          variant="secondary"
          onClick={() => router.push("/register")}
        >
          {t("register.title")}
        </Button>
      </form>
    </div>
  );
}
