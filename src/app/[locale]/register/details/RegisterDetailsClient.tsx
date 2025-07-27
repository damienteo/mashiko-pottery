"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppDispatch } from "@/store/hooks";
import { createUserProfile } from "@/store/user/userSlice";
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
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  phone: string;
  gender: "male" | "female" | "other" | "none";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  zip: string;
  pref: string;
  city: string;
  street: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  firstName: yup.string().required("validation.firstName.required"),
  lastName: yup.string().required("validation.lastName.required"),
  firstNameKana: yup
    .string()
    .required("validation.firstNameKana.required")
    .matches(/^[\u30A0-\u30FFー]*$/, "validation.firstNameKana.katakana"),
  lastNameKana: yup
    .string()
    .required("validation.lastNameKana.required")
    .matches(/^[\u30A0-\u30FFー]*$/, "validation.lastNameKana.katakana"),
  phone: yup
    .string()
    .required("validation.phone.required")
    .min(10, "validation.phone.invalid"),
  gender: yup
    .mixed<"male" | "female" | "other" | "none">()
    .oneOf(["male", "female", "other", "none"])
    .required("validation.gender.required"),
  birthYear: yup
    .number()
    .typeError("validation.birthYear.number")
    .required("validation.birthYear.required")
    .min(1900, "validation.birthYear.invalid"),
  birthMonth: yup
    .number()
    .typeError("validation.birthMonth.number")
    .required("validation.birthMonth.required")
    .min(1, "validation.birthMonth.range")
    .max(12, "validation.birthMonth.range"),
  birthDay: yup
    .number()
    .typeError("validation.birthDay.number")
    .required("validation.birthDay.required")
    .min(1, "validation.birthDay.range")
    .max(31, "validation.birthDay.range"),
  zip: yup
    .string()
    .required("validation.zip.required")
    .matches(/^\d{7}$/, "validation.zip.invalid"),
  pref: yup
    .string()
    .required("validation.pref.required")
    .max(50, "validation.pref.tooLong"),
  city: yup
    .string()
    .required("validation.city.required")
    .max(100, "validation.city.tooLong"),
  street: yup
    .string()
    .required("validation.street.required")
    .max(100, "validation.street.tooLong"),
});

export default function RegisterDetailsForm({ callback }: Props) {
  const t = useTranslations();
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

  console.log({ errors });

  const onSubmit = async (data: FormData) => {
    try {
      const resultAction = await dispatch(createUserProfile(data));

      if (createUserProfile.fulfilled.match(resultAction)) {
        success(t("register.success"));

        const guestItems = loadCartFromStorage();
        if (guestItems.length > 0) {
          await dispatch(mergeCart(guestItems));
          clearCartFromStorage();
        }
        await dispatch(fetchCart());
        router.push(callback);
      } else {
        throw new Error("Profile creation failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError("firstName", { message: t("register.error") });
        toastError(t("register.error"));
      } else {
        setFormError("firstName", { message: t("register.unknownError") });
        toastError(t("register.unknownError"));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">{t("register.title")}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="on"
      >
        <div>
          <label htmlFor="firstName" className="block mb-1">
            {t("register.firstName")}
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            placeholder={t("register.firstNamePlaceholder")}
            className={`w-full p-2 border rounded ${errors.firstName ? "border-red-600" : ""}`}
          />
          {errors.firstName?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.firstName.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-1">
            {t("register.lastName")}
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            placeholder={t("register.lastNamePlaceholder")}
            className={`w-full p-2 border rounded ${errors.lastName ? "border-red-600" : ""}`}
          />
          {errors.lastName?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.lastName.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="firstNameKana" className="block mb-1">
            {t("register.firstNameKana")}
          </label>
          <input
            id="firstNameKana"
            type="text"
            {...register("firstNameKana")}
            placeholder="カタカナ"
            className={`w-full p-2 border rounded ${errors.firstNameKana ? "border-red-600" : ""}`}
          />
          {errors.firstNameKana?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.firstNameKana.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="lastNameKana" className="block mb-1">
            {t("register.lastNameKana")}
          </label>
          <input
            id="lastNameKana"
            type="text"
            {...register("lastNameKana")}
            placeholder="カタカナ"
            className={`w-full p-2 border rounded ${errors.lastNameKana ? "border-red-600" : ""}`}
          />
          {errors.lastNameKana?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.lastNameKana.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1">
            {t("register.phone")}
          </label>
          <input
            id="phone"
            type="text"
            {...register("phone")}
            placeholder="09012345678"
            className={`w-full p-2 border rounded ${errors.phone ? "border-red-600" : ""}`}
          />
          {errors.phone?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.phone.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="gender" className="block mb-1">
            {t("register.gender")}
          </label>
          <select
            id="gender"
            {...register("gender")}
            className={`w-full p-2 border rounded ${errors.gender ? "border-red-600" : ""}`}
          >
            <option value="none">{t("register.genderNotSelected")}</option>
            <option value="male">{t("register.genderMale")}</option>
            <option value="female">{t("register.genderFemale")}</option>
            <option value="other">{t("register.genderOther")}</option>
          </select>
          {errors.gender?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.gender.message)}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <div className="w-1/3">
            <label htmlFor="birthYear" className="block mb-1">
              {t("register.birthYear")}
            </label>
            <input
              id="birthYear"
              type="number"
              {...register("birthYear")}
              placeholder="1980"
              className={`w-full p-2 border rounded ${errors.birthYear ? "border-red-600" : ""}`}
            />
            {errors.birthYear?.message && (
              <p className="text-red-600 mt-1">
                {t("register." + errors.birthYear.message)}
              </p>
            )}
          </div>
          <div className="w-1/3">
            <label htmlFor="birthMonth" className="block mb-1">
              {t("register.birthMonth")}
            </label>
            <input
              id="birthMonth"
              type="number"
              {...register("birthMonth")}
              placeholder="1"
              className={`w-full p-2 border rounded ${errors.birthMonth ? "border-red-600" : ""}`}
            />
            {errors.birthMonth?.message && (
              <p className="text-red-600 mt-1">
                {t("register." + errors.birthMonth.message)}
              </p>
            )}
          </div>
          <div className="w-1/3">
            <label htmlFor="birthDay" className="block mb-1">
              {t("register.birthDay")}
            </label>
            <input
              id="birthDay"
              type="number"
              {...register("birthDay")}
              placeholder="1"
              className={`w-full p-2 border rounded ${errors.birthDay ? "border-red-600" : ""}`}
            />
            {errors.birthDay?.message && (
              <p className="text-red-600 mt-1">
                {t("register." + errors.birthDay.message)}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="zip" className="block mb-1">
            {t("register.zip")}
          </label>
          <input
            id="zip"
            type="text"
            {...register("zip")}
            placeholder="0000000"
            className={`w-full p-2 border rounded ${errors.zip ? "border-red-600" : ""}`}
          />
          {errors.zip?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.zip.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="pref" className="block mb-1">
            {t("register.pref")}
          </label>
          <input
            id="pref"
            type="text"
            {...register("pref")}
            placeholder="選択してください"
            className={`w-full p-2 border rounded ${errors.pref ? "border-red-600" : ""}`}
          />
          {errors.pref?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.pref.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="city" className="block mb-1">
            {t("register.city")}
          </label>
          <input
            id="city"
            type="text"
            {...register("city")}
            placeholder="〇〇市△△町123番地"
            className={`w-full p-2 border rounded ${errors.city ? "border-red-600" : ""}`}
          />
          {errors.city?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.city.message)}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="street" className="block mb-1">
            {t("register.street")}
          </label>
          <input
            id="street"
            type="text"
            {...register("street")}
            placeholder="××マンション123号"
            className={`w-full p-2 border rounded ${errors.street ? "border-red-600" : ""}`}
          />
          {errors.street?.message && (
            <p className="text-red-600 mt-1">
              {t("register." + errors.street.message)}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t("register.submitting") : t("register.submit")}
        </Button>
      </form>
    </div>
  );
}
