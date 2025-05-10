"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import "./tiptap.scss";

const Tiptap: React.FC<{ defaultContent: string | null }> = ({
  defaultContent,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: defaultContent,
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} className="tiptap-editor" />;
};

export default Tiptap;
