"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAdminPotters,
  selectAdminPotterLoading,
  selectAdminPotterError,
} from "@/store/admin/potterSlice";
import { fetchPottersList } from "@/store/thunks/fetchPottersList";
// import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const potterSchema = yup.object({
  name: yup.string().required("Name is required"),
  bio: yup.string().required("Bio is required"),
  style: yup.string().required("Style is required"),
});
type PotterFormValues = yup.InferType<typeof potterSchema>;

export default function PottersClient() {
  const t = useTranslations("admin.pages.potters");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const potters = useAppSelector(selectAdminPotters);
  const isLoading = useAppSelector(selectAdminPotterLoading);
  const error = useAppSelector(selectAdminPotterError);
  // const { success } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PotterFormValues>({
    mode: "onChange",
    resolver: yupResolver(potterSchema),
  });

  const onSubmit: SubmitHandler<PotterFormValues> = () => {
    // TODO: dispatch updatePotter({ id: editingId!, ...data });
    setEditingId(null);
  };

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched && !isLoading && potters.length === 0) {
      dispatch(fetchPottersList({}));
      setHasFetched(true);
    }
  }, [dispatch, isLoading, potters.length, hasFetched]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{t("error")}</p>
        <Button onClick={() => dispatch(fetchPottersList({}))} className="mt-4">
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center space-x-2">
        <span>{t("title")}</span>
        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("image")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("name")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("bio")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("style")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("active")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("id")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {potters.map((p) => {
              const name =
                p.name[locale as keyof typeof p.name] || String(p.name);
              const desc = p.bio ? p.bio[locale as keyof typeof p.bio] : "";

              return (
                <tr key={p.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="w-12 h-12 relative">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        {...register("name")}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      name
                    )}
                    {errors.name && editingId === p.id && (
                      <span className="text-red-600 text-xs">
                        {errors.name.message}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 line-clamp-2">
                    {editingId === p.id ? (
                      <textarea
                        {...register("bio")}
                        rows={2}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      desc
                    )}
                    {errors.bio && editingId === p.id && (
                      <span className="text-red-600 text-xs">
                        {errors.bio.message}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        {...register("style")}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      (p.style ?? "-")
                    )}
                    {errors.style && editingId === p.id && (
                      <span className="text-red-600 text-xs">
                        {errors.style.message}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {p.active ? t("active") : "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{p.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                    {editingId === p.id ? (
                      <>
                        <Button
                          onClick={() => handleSubmit(onSubmit)()}
                          variant="primary"
                          disabled={!isValid}
                        >
                          {t("confirm")}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            reset();
                            setEditingId(null);
                          }}
                        >
                          {t("cancel")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            reset({
                              name,
                              bio: desc,
                              style: p.style ?? "",
                            });
                            setEditingId(p.id);
                          }}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            /* TODO: delete */
                          }}
                        >
                          {t("delete")}
                        </Button>
                        <Link
                          href={`/${locale}/admin/potters/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="secondary">{t("details")}</Button>
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* end table */}
    </div>
  );
}
