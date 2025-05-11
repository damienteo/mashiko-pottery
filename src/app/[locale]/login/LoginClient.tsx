"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/authSlice";
import { useToast } from "@/components/ui/Toast";
import {
  loadCartFromStorage,
  clearCartFromStorage,
} from "@/store/localStorage";
import { mergeCart, fetchCart } from "@/store/cartSlice";

interface Props {
  callback: string;
}

export default function LoginClient({ callback }: Props) {
  const t = useTranslations();
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}
        <div>
          <label className="block mb-1">{t("login.username")}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">{t("login.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? t("login.loading") : t("login.submit")}
        </button>
      </form>
    </div>
  );
}
