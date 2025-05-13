"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSellerProfile,
  updateSellerProfile,
  selectSellerProfile,
  selectSellerLoading,
  selectSellerError,
} from "@/store/sellerSlice";
import Button from "@/components/ui/Button";
import { localeLabels } from "@/constants/localeLabels";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";
import { $getRoot, TextNode, $createParagraphNode } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import RichTextViewer from "@/components/ui/RichTextViewer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
const LexicalComposer = dynamic(
  () =>
    import("@lexical/react/LexicalComposer").then((mod) => mod.LexicalComposer),
  { ssr: false }
);
const RichTextPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalRichTextPlugin").then(
      (mod) => mod.RichTextPlugin
    ),
  { ssr: false }
);
const ContentEditable = dynamic(
  () =>
    import("@lexical/react/LexicalContentEditable").then(
      (mod) => mod.ContentEditable
    ),
  { ssr: false }
);
const OnChangePlugin = dynamic(
  () =>
    import("@lexical/react/LexicalOnChangePlugin").then(
      (mod) => mod.OnChangePlugin
    ),
  { ssr: false }
);
const HistoryPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalHistoryPlugin").then(
      (mod) => mod.HistoryPlugin
    ),
  { ssr: false }
);

const ListPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalListPlugin").then((mod) => mod.ListPlugin),
  { ssr: false }
);
const ErrorBoundary = dynamic(
  () =>
    import("@lexical/react/LexicalErrorBoundary").then(
      (mod) => mod.LexicalErrorBoundary
    ),
  { ssr: false }
);

function InitialContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!html) return;
    editor.update(() => {
      // Create a temporary container to parse the HTML fragment
      const container = document.createElement("div");
      container.innerHTML = html;
      const root = $getRoot();
      root.clear();
      // Generate nodes from the container's child elements only
      const nodes = $generateNodesFromDOM(editor, container);
      nodes.forEach((node) => {
        if (node instanceof TextNode) {
          // Wrap plain text in a paragraph
          const p = $createParagraphNode();
          p.append(node);
          root.append(p);
        } else {
          root.append(node);
        }
      });
    });
  }, [editor, html]);
  return null;
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  return (
    <div className="mb-2 flex space-x-2">
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="px-2 py-1 border rounded"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="px-2 py-1 border rounded"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="px-2 py-1 border rounded"
      >
        U
      </button>
      <button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className="px-2 py-1 border rounded"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className="px-2 py-1 border rounded"
      >
        1. List
      </button>
    </div>
  );
}

const editorConfig = {
  namespace: "SellerProfileBio",
  theme: {},
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  onError: (error: Error) => console.error(error),
};

const profileSchema = yup.object({
  name: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    "zh-CN": yup.string().required(),
  }),
  bio: yup.object({
    en: yup.string().max(2000, "Max 2000 characters").required(),
    ja: yup.string().max(2000, "最大2000文字").required(),
    "zh-CN": yup.string().max(2000, "最多2000个字符").required(),
  }),
  portfolio: yup.object({
    en: yup
      .string()
      .max(1000, "Max 1000 characters")
      .required("Portfolio is required"),
    ja: yup
      .string()
      .max(1000, "最大1000文字")
      .required("Portfolio is required"),
    "zh-CN": yup
      .string()
      .max(1000, "最多1000个字符")
      .required("Portfolio is required"),
  }),
});
type ProfileFormValues = yup.InferType<typeof profileSchema>;

export default function SellerProfileClient() {
  const t = useTranslations("seller.profile");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const profile = useAppSelector(selectSellerProfile);
  const isLoading = useAppSelector(selectSellerLoading);
  const error = useAppSelector(selectSellerError);

  // Load profile on mount
  useEffect(() => {
    if (!profile && !isLoading) {
      dispatch(fetchSellerProfile());
    }
  }, [dispatch, profile, isLoading]);

  // Prepare default values once profile arrives
  const defaults: ProfileFormValues = profile
    ? {
        name: {
          en: profile.name?.en ?? "",
          ja: profile.name?.ja ?? "",
          "zh-CN": profile.name?.["zh-CN"] ?? "",
        },
        bio: {
          en: profile.bio?.en ?? "",
          ja: profile.bio?.ja ?? "",
          "zh-CN": profile.bio?.["zh-CN"] ?? "",
        },
        portfolio: {
          en: profile.portfolio?.en ?? "",
          ja: profile.portfolio?.ja ?? "",
          "zh-CN": profile.portfolio?.["zh-CN"] ?? "",
        },
      }
    : {
        name: { en: "", ja: "", "zh-CN": "" },
        bio: { en: "", ja: "", "zh-CN": "" },
        portfolio: { en: "", ja: "", "zh-CN": "" },
      };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProfileFormValues>({
    mode: "onChange",
    resolver: yupResolver(profileSchema),
    defaultValues: defaults,
  });

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      reset(defaults);
    }
  }, [profile, reset]);

  if (isLoading) {
    return <p className="p-8">{t("loading")}</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{t("error")}</p>;
  }

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    dispatch(updateSellerProfile(data));
    setIsEditing(false);
  };

  // Non-edit detail view
  if (!isEditing) {
    return (
      <div className="mt-8 p-8 max-w-7xl mx-auto space-y-6 bg-gray-50 border-l-4 border-blue-500">
        <h1 className="text-2xl font-bold text-blue-700">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h2 className="font-medium">
              {t("fields.name")} ({localeLabels.en})
            </h2>
            <p>{profile?.name.en}</p>
          </div>
          <div>
            <h2 className="font-medium">
              {t("fields.name")} ({localeLabels.ja})
            </h2>
            <p>{profile?.name.ja}</p>
          </div>
          <div>
            <h2 className="font-medium">
              {t("fields.name")} ({localeLabels["zh-CN"]})
            </h2>
            <p>{profile?.name["zh-CN"]}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h2 className="font-medium">
              {t("fields.bio")} ({localeLabels.en})
            </h2>
            <RichTextViewer html={profile?.bio.en || ""} />
          </div>
          <div>
            <h2 className="font-medium">
              {t("fields.bio")} ({localeLabels.ja})
            </h2>
            <RichTextViewer html={profile?.bio.ja || ""} />
          </div>
          <div>
            <h2 className="font-medium">
              {t("fields.bio")} ({localeLabels["zh-CN"]})
            </h2>
            <RichTextViewer html={profile?.bio["zh-CN"] || ""} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h2 className="font-medium">
              {t("fields.portfolio")} ({localeLabels.en})
            </h2>
            <p>{profile?.portfolio.en}</p>
          </div>
          <div>
            <h2 className="font-medium">
              {t("fields.portfolio")} ({localeLabels.ja})
            </h2>
            <p>{profile?.portfolio.ja}</p>
          </div>
          <div>
            <h2 className="font-medium">
              {t("fields.portfolio")} ({localeLabels["zh-CN"]})
            </h2>
            <p>{profile?.portfolio["zh-CN"]}</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setIsEditing(true)}>
          {t("actions.edit")}
        </Button>
      </div>
    );
  }

  // Edit form view
  return (
    <div className="mt-8 p-8 max-w-7xl mx-auto space-y-6 bg-gray-50 border-l-4 border-blue-500">
      <h1 className="text-2xl font-bold text-blue-700">{t("title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">
              {t("fields.name")} (EN)
            </label>
            <input
              {...register("name.en")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.name?.en && (
              <p className="text-red-600 text-xs mt-1">
                {errors.name.en.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.name")} (JA)
            </label>
            <input
              {...register("name.ja")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.name?.ja && (
              <p className="text-red-600 text-xs mt-1">
                {errors.name.ja.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.name")} (ZH-CN)
            </label>
            <input
              {...register("name.zh-CN")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.name?.["zh-CN"] && (
              <p className="text-red-600 text-xs mt-1">
                {errors.name["zh-CN"]?.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["en", "ja", "zh-CN"] as const).map((loc) => (
            <Controller
              key={loc}
              control={control}
              name={`bio.${loc}`}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium">
                    {t("fields.bio")} ({localeLabels[loc]})
                  </label>
                  <LexicalComposer
                    initialConfig={{
                      ...editorConfig,
                    }}
                  >
                    <HistoryPlugin />
                    <Toolbar />
                    <ListPlugin />
                    <InitialContentPlugin html={field.value || ""} />
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable className="mt-1 block w-full border p-2 rounded min-h-[150px]" />
                      }
                      placeholder={
                        <div className="text-gray-400">
                          {t("fields.bio")} ({localeLabels[loc]})
                        </div>
                      }
                      ErrorBoundary={ErrorBoundary}
                    />
                    <OnChangePlugin
                      onChange={(editorState, editor) => {
                        editorState.read(() => {
                          const html = $generateHtmlFromNodes(editor, null);
                          field.onChange(html);
                        });
                      }}
                    />
                  </LexicalComposer>
                  {errors.bio?.[loc] && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.bio[loc]?.message}
                    </p>
                  )}
                </div>
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">
              {t("fields.portfolio")} (EN)
            </label>
            <input
              {...register("portfolio.en")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.portfolio?.en && (
              <p className="text-red-600 text-xs mt-1">
                {errors.portfolio.en.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.portfolio")} (JA)
            </label>
            <input
              {...register("portfolio.ja")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.portfolio?.ja && (
              <p className="text-red-600 text-xs mt-1">
                {errors.portfolio.ja.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("fields.portfolio")} (ZH-CN)
            </label>
            <input
              {...register("portfolio.zh-CN")}
              className="mt-1 block w-full border p-2 rounded"
            />
            {errors.portfolio?.["zh-CN"] && (
              <p className="text-red-600 text-xs mt-1">
                {errors.portfolio["zh-CN"]?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" variant="primary" disabled={!isValid}>
            {t("actions.save")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset(defaults);
              setIsEditing(false);
            }}
          >
            {t("actions.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
