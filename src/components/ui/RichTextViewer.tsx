"use client";

import React from "react";
import DOMPurify from "isomorphic-dompurify";

interface RichTextViewerProps {
  html: string;
}

export default function RichTextViewer({ html }: RichTextViewerProps) {
  const clean = DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "width",
      "height",
      "src",
      "title",
    ],
  });

  return (
    <div
      className="prose max-w-none [&_iframe]:w-full [&_iframe]:aspect-video"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
