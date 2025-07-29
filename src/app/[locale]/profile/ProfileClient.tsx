"use client";

import { useTranslations } from "next-intl";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateUserProfile,
  createUserProfile,
  selectUserProfile,
} from "@/store/user/userSlice";

import { useToast } from "@/components/ui/Toast";
import UserProfileForm, { FormData } from "@/components/forms/UserProfileForm";

export default function ProfileClient() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { success, error: toastError } = useToast();
  const userProfile = useAppSelector(selectUserProfile);

  const onSubmit = async (data: FormData) => {
    try {
      if (!userProfile) {
        const resultAction = await dispatch(createUserProfile(data));

        if (createUserProfile.fulfilled.match(resultAction)) {
          success(t("register.completeProfile.success"));

          // KIV
          // const guestItems = loadCartFromStorage();
          // if (guestItems.length > 0) {
          //   await dispatch(mergeCart(guestItems));
          //   clearCartFromStorage();
          // }
          // await dispatch(fetchCart());
        } else {
          throw new Error(t("profile.create.error"));
        }
        return;
      }

      // Compare current profile with form data and collect updated fields
      const updatedFields = Object.entries(data).reduce((acc, [key, value]) => {
        if (key in userProfile) {
          const typedKey = key as keyof FormData;
          if (value !== userProfile[typedKey]) {
            acc[typedKey] = value;
          }
        }
        return acc;
      }, {} as Partial<FormData>);

      if (Object.keys(updatedFields).length === 0) {
        success(t("profile.update.noChanges"));
        return;
      }

      const resultAction = await dispatch(updateUserProfile(updatedFields));

      if (updateUserProfile.fulfilled.match(resultAction)) {
        success(t("profile.update.success"));
      } else {
        throw new Error("Profile update failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toastError(t("profile.update.error") + ` ${err.message}`);
      } else {
        toastError(t("profile.update.unknownError"));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">
        {!!userProfile
          ? t("profile.update.title")
          : t("register.completeProfile.title")}
      </h1>
      <UserProfileForm
        onSubmit={onSubmit}
        submitLabel={t("profile.update.submit")}
      />
    </div>
  );
}
