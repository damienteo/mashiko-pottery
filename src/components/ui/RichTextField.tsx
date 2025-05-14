"use client";

import React from "react";
import { Controller, Control } from "react-hook-form";
import { Path } from "react-hook-form";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $generateHtmlFromNodes } from "@lexical/html";
import { deserializeHtmlToEditor } from "@/lib/lexical/deserializeHtmlToEditor";

interface RichTextFieldProps<T extends Record<string, unknown>> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  defaultValue?: string;
  editorConfig: InitialConfigType;
}

// TODO: Need to show iframe and update toolbar
// https://github.com/usmanabdurrehman/Lexical-Tutorials/tree/LexicalAdvanced/src

export default function RichTextField<T extends Record<string, unknown>>({
  control,
  name,
  label,
  error,
  editorConfig,
}: RichTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <label className="block text-sm font-medium">{label}</label>
          <LexicalComposer
            initialConfig={{
              ...editorConfig,
              editorState: (editor) => {
                const html = String(field.value || "");
                if (html) {
                  deserializeHtmlToEditor(html, editor);
                }
                return editor.getEditorState();
              },
            }}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="mt-1 block w-full border p-2 rounded min-h-[150px]" />
              }
              placeholder={<div className="text-gray-400">{label}</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <OnChangePlugin
              onChange={(editorState, editor) => {
                editorState.read(() => {
                  const html = $generateHtmlFromNodes(editor, undefined);
                  field.onChange(html);
                });
              }}
            />
          </LexicalComposer>
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
      )}
    />
  );
}
