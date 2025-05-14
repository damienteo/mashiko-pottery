import {
  $getRoot,
  TextNode,
  $createParagraphNode,
  LexicalEditor,
} from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";

export function deserializeHtmlToEditor(html: string, editor: LexicalEditor) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  editor.update(() => {
    const nodes = $generateNodesFromDOM(editor, doc);
    const root = $getRoot();
    root.clear();
    nodes.forEach((node) => {
      if (node instanceof TextNode) {
        const p = $createParagraphNode();
        p.append(node);
        root.append(p);
      } else {
        root.append(node);
      }
    });
  });
}
