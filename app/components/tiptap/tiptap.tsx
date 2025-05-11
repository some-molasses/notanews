"use client";

import { useEditor, EditorContent, EditorEvents } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import React from "react";
import "./tiptap.scss";

const Tiptap: React.FC<{
  defaultContent: string | null;
  onUpdate: (props: EditorEvents["update"]) => void;
}> = ({ defaultContent, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Highlight,
      Typography,
    ],
    content: defaultContent,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate: onUpdate,
  });

  return <EditorContent editor={editor} className="tiptap-editor" />;
};

export default Tiptap;
