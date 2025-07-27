import { useTranslations } from "next-intl";

export default function RegisterEmailSentClient() {
  const t = useTranslations();

  return (
    <div className="max-w-md mx-auto my-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-4">
        {t("register.emailSent.title")}
      </h1>
      <p className="text-gray-700 mb-6">
        {t("register.emailSent.instructions")}
      </p>
    </div>
  );
}
