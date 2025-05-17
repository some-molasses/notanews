"use client";

import { useEditor, EditorContent, EditorEvents } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import React from "react";
import "./tiptap.scss";
import { TiptapMenuBar } from "./tiptap-menubar";

const Tiptap: React.FC<{
  defaultContent: string | null;
  onUpdate: (props: EditorEvents["update"]) => void;
  editable: boolean;
}> = ({ defaultContent, onUpdate, editable }) => {
  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Highlight,
    Typography,
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
  ];

  const editor = useEditor({
    extensions: extensions,
    content: defaultContent,
    immediatelyRender: false,
    // shouldRerenderOnTransaction: false,
    onUpdate: onUpdate,
    editable: editable,
  });

  if (!editor) {
    return null;
  }

  if (editable && !editor.isEditable) {
    editor.setEditable(true);
  }

  return (
    <>
      {editable ? <TiptapMenuBar editor={editor} /> : null}
      <EditorContent editor={editor} className="tiptap-editor" />
    </>
  );
};

export default Tiptap;
