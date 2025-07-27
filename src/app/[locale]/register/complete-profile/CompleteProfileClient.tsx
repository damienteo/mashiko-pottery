"use client";

import { useTranslations } from "next-intl";

import { useAppDispatch } from "@/store/hooks";
import { createUserProfile } from "@/store/user/userSlice";
import {
  loadCartFromStorage,
  clearCartFromStorage,
} from "@/store/localStorage";
import { mergeCart, fetchCart } from "@/store/cartSlice";

import { useToast } from "@/components/ui/Toast";
import UserProfileForm, { FormData } from "@/components/forms/UserProfileForm";

export default function RegisterDetailsForm() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { success, error: toastError } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      const resultAction = await dispatch(createUserProfile(data));

      if (createUserProfile.fulfilled.match(resultAction)) {
        success(t("register.completeProfile.success"));

        const guestItems = loadCartFromStorage();
        if (guestItems.length > 0) {
          await dispatch(mergeCart(guestItems));
          clearCartFromStorage();
        }
        await dispatch(fetchCart());
      } else {
        throw new Error("Profile creation failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toastError(t("register.error"));
      } else {
        toastError(t("register.unknownError"));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">
        {t("register.completeProfile.title")}
      </h1>
      <UserProfileForm onSubmit={onSubmit} submitLabel={t("register.submit")} />
    </div>
  );
}
