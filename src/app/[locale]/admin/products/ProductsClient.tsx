"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAdminProductListItems,
  selectAdminProductListLoading,
  selectAdminProductListError,
} from "@/store/admin/productSlice";
import { fetchProductsList } from "@/store/thunks/fetchProductsList";
// import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { formatYen } from "@/utils/format";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const productSchema = yup.object({
  title: yup.string().required("Title is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  description: yup
    .string()
    .max(200, "Max 200 characters")
    .required("Description is required"),
  inventory: yup
    .number()
    .typeError("Inventory must be a number")
    .integer("Inventory must be an integer")
    .min(0, "Inventory cannot be negative")
    .required("Inventory is required"),
});
type ProductFormValues = yup.InferType<typeof productSchema>;

export default function ProductsClient() {
  const t = useTranslations("admin.pages.products");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAdminProductListItems);
  const isLoading = useAppSelector(selectAdminProductListLoading);
  const error = useAppSelector(selectAdminProductListError);
  // const { success } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  console.log({ products, isLoading, error });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProductFormValues>({
    mode: "onChange",
    resolver: yupResolver(productSchema),
  });

  const onSubmit: SubmitHandler<ProductFormValues> = () => {
    // TODO: dispatch updateProduct({ id: editingId!, ...data });
    setEditingId(null);
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && !isLoading && products.length === 0) {
      dispatch(fetchProductsList({}));
      hasFetched.current = true;
    }
  }, [dispatch, isLoading, products.length]);

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
        <Button
          onClick={() => dispatch(fetchProductsList({}))}
          className="mt-4"
        >
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
                Image
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Inventory
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Potter ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Weight
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => {
              const title =
                p.title[locale as keyof typeof p.title] || String(p.title);
              const desc = p.description
                ? p.description[locale as keyof typeof p.description]
                : "";

              return (
                <tr key={p.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={p.photos[0]}
                        alt={title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        {...register("title")}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      title
                    )}
                    {errors.title && editingId === p.id && (
                      <span className="text-red-600 text-xs">
                        {errors.title.message}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        {...register("price")}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      formatYen(p.price)
                    )}
                    {errors.price && editingId === p.id && (
                      <span className="text-red-600 text-xs">
                        {errors.price.message}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 line-clamp-2">
                    {editingId === p.id ? (
                      <textarea
                        {...register("description")}
                        rows={2}
                        className="w-full border p-1 rounded text-sm"
                      />
                    ) : (
                      desc
                    )}
                    {errors.description && editingId === p.id && (
                      <span className="text-red-600 text-xs">
                        {errors.description.message}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        {...register("inventory")}
                        className="w-20 border p-1 rounded text-sm"
                      />
                    ) : (
                      p.inventory
                    )}
                    {errors.inventory && editingId === p.id && (
                      <span className="text-red-600 text-xs">
                        {errors.inventory.message}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{p.potterId}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {p.weight ?? "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {p.category ?? "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                    {editingId === p.id ? (
                      <>
                        <Button
                          onClick={() => handleSubmit(onSubmit)()}
                          variant="primary"
                          disabled={!isValid}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            reset();
                            setEditingId(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            reset({
                              title,
                              price: p.price,
                              description: desc,
                              inventory: p.inventory,
                            });
                            setEditingId(p.id);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            /* TODO: delete action */
                          }}
                        >
                          Delete
                        </Button>
                        <Link
                          href={`/${locale}/admin/products/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="secondary">Details</Button>
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
