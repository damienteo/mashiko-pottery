"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { updateItem } from "@/store/seller/sellerInventorySlice";
import Button from "@/components/ui/Button";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  sku: yup.string().required("SKU is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .integer("Stock must be an integer")
    .min(0, "Stock must be at least 0")
    .required("Stock is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price must be at least 0")
    .required("Price is required"),
  active: yup.boolean().notRequired().default(false),
});

type InventoryFormValues = yup.InferType<typeof schema>;

export default function EditableInventoryRow({
  item,
  onCancel,
}: {
  item: {
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: number;
    active?: boolean;
    potterId: string;
  };
  onCancel: () => void;
}) {
  const t = useTranslations("seller.inventory");
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<InventoryFormValues>({
    defaultValues: {
      name: item.name,
      sku: item.sku,
      stock: item.stock,
      price: item.price,
      active: item.active,
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<InventoryFormValues> = (data) => {
    dispatch(
      updateItem({
        id: item.id,
        potterId: item.potterId,
        ...data,
        active: data.active ?? false,
      }),
    );
    onCancel();
  };

  return (
    <tr key={item.id} id={`row-${item.id}`}>
      <td className="px-3 py-2 whitespace-nowrap">
        <input
          {...register("name")}
          className="w-full border p-1 rounded text-sm"
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <input
          {...register("sku")}
          className="w-full border p-1 rounded text-sm"
        />
        {errors.sku && (
          <span className="text-red-500 text-xs">{errors.sku.message}</span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <input
          {...register("stock")}
          type="number"
          className="w-full border p-1 rounded text-sm"
        />
        {errors.stock && (
          <span className="text-red-500 text-xs">{errors.stock.message}</span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <input
          {...register("price")}
          type="number"
          className="w-full border p-1 rounded text-sm"
        />
        {errors.price && (
          <span className="text-red-500 text-xs">{errors.price.message}</span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <label className="inline-flex items-center">
          <input {...register("active")} type="checkbox" className="mr-2" />
          {t("active")}
        </label>
      </td>
      <td className="px-3 py-2 whitespace-nowrap space-x-2 flex items-center">
        <Button
          variant="confirm"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          ✅ {t("done")}
        </Button>
        <Button variant="cancel" onClick={onCancel}>
          ❌ {t("cancel")}
        </Button>
      </td>
    </tr>
  );
}
