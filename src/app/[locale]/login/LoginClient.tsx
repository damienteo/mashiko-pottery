"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

interface FormData {
  username: string;
  password: string;
}

const schema = yup.object({
  username: yup
    .string()
    .required("validation.username.required")
    .min(8, "validation.username.min"),
  password: yup
    .string()
    .required("validation.password.required")
    .min(8, "validation.password.min"),
});

export default function LoginClient({ callback }: Props) {
  const t = useTranslations("common");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Dispatch login thunk (which returns user on success)
      const resultAction = await dispatch(
        login({ email: data.username, password: data.password })
      );
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
        setFormError("password", { message: t("login.error") });
        toastError(t("login.error"));
      } else {
        setFormError("password", { message: t("login.unknownError") });
        toastError(t("login.unknownError"));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">{t("login.title")}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="on"
      >
        <div>
          <label htmlFor="username" className="block mb-1">
            {t("login.username")}
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            {...register("username")}
            className={`w-full p-2 border rounded ${errors.username ? "border-red-600" : ""}`}
          />
          {errors.username?.message && (
            <p className="text-red-600 mt-1">{t(errors.username.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            {t("login.password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={`w-full p-2 border rounded ${errors.password ? "border-red-600" : ""}`}
          />
          {errors.password?.message && (
            <p className="text-red-600 mt-1">{t(errors.password.message)}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t("login.loading") : t("login.submit")}
        </Button>

        <Button
          type="button"
          disabled={isSubmitting}
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
