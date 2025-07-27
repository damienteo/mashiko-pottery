"use client";

import { useTranslations } from "next-intl";

import { useAppDispatch } from "@/store/hooks";
import { updateUserProfile } from "@/store/user/userSlice";

import { useToast } from "@/components/ui/Toast";
import UserProfileForm, { FormData } from "@/components/forms/UserProfileForm";

export default function ProfileClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { success, error: toastError } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      const resultAction = await dispatch(updateUserProfile(data));

      if (updateUserProfile.fulfilled.match(resultAction)) {
        success(t("profile.update.success"));
      } else {
        throw new Error("Profile update failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toastError(t("profile.update.error"));
      } else {
        toastError(t("profile.update.unknownError"));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">{t("profile.update.title")}</h1>
      <UserProfileForm
        onSubmit={onSubmit}
        submitLabel={t("profile.update.submit")}
      />
    </div>
  );
}
