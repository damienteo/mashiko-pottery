"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslations } from "next-intl";
import { Payout } from "@/types/payout";
import Button from "@/components/ui/Button";
import { formatYen } from "@/utils/format";

const schema = yup.object({
  amount: yup.number().min(0).required(),
  status: yup
    .string()
    .oneOf(["pending", "processing", "paid", "failed"])
    .required(),
});
type PayoutFormValues = yup.InferType<typeof schema>;

interface Props {
  payout: Payout;
  isEditing: boolean;
  onCancel: () => void;
  onEdit: () => void;
}

export default function EditablePayoutRow({
  payout,
  isEditing,
  onCancel,
  onEdit,
}: Props) {
  const t = useTranslations("seller.payouts");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PayoutFormValues>({
    defaultValues: {
      amount: payout.amount,
      status: payout.status,
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<PayoutFormValues> = (data) => {
    console.log("Updated payout:", { id: payout.id, ...data });
    onCancel();
  };

  return (
    <tr key={payout.id}>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
        {payout.id}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
        {isEditing ? (
          <input
            type="number"
            {...register("amount")}
            className="border p-1 text-sm w-24"
          />
        ) : (
          formatYen(payout.amount)
        )}
        {errors.amount && isEditing && (
          <p className="text-xs text-red-600">{errors.amount.message}</p>
        )}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 capitalize">
        {isEditing ? (
          <select {...register("status")} className="border p-1 text-sm">
            <option value="pending">{t("status.pending")}</option>
            <option value="processing">{t("status.processing")}</option>
            <option value="paid">{t("status.paid")}</option>
            <option value="failed">{t("status.failed")}</option>
          </select>
        ) : (
          t(`status.${payout.status}`)
        )}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
        {new Date(payout.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
        {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : "-"}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm space-x-2">
        {isEditing ? (
          <>
            <Button
              variant="confirm"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
            >
              {t("buttons.confirm")}
            </Button>
            <Button variant="cancel" onClick={onCancel}>
              {t("buttons.cancel")}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onEdit}>
              {t("buttons.edit")}
            </Button>
            <a
              href={`./payouts/${payout.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="secondary">{t("details.link")}</Button>
            </a>
          </>
        )}
      </td>
    </tr>
  );
}
