"use client";

import { Editor } from "@tiptap/react";
import "./tiptap-menubar.scss";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faCode,
  faEraser,
  faImage,
  faItalic,
  faListDots,
  faListNumeric,
  faParagraph,
  faQuoteLeft,
  faRotateLeft,
  faRotateRight,
  faStrikethrough,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const TiptapMenuBar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [colour, setColour] = useState("#aabbcc");
  const [displayColourPicker, setDisplayColourPicker] = useState(false);

  const getClassFor = (style: string, attributes?: {}): string => {
    if (!editor) {
      return "";
    }

    return editor.isActive(style, attributes) ? "is-active" : "";
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={getClassFor("bold")}
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={getClassFor("italic")}
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={getClassFor("strike")}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={getClassFor("code")}
        >
          <FontAwesomeIcon icon={faTerminal} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <FontAwesomeIcon icon={faEraser} />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={getClassFor("paragraph")}
        >
          <FontAwesomeIcon icon={faParagraph} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={getClassFor("heading", { level: 1 })}
        >
          Heading 1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={getClassFor("heading", { level: 2 })}
        >
          Heading 2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={getClassFor("heading", { level: 3 })}
        >
          Heading 3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getClassFor("bulletList")}
        >
          <FontAwesomeIcon icon={faListDots} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getClassFor("orderedList")}
        >
          <FontAwesomeIcon icon={faListNumeric} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={getClassFor("codeBlock")}
        >
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getClassFor("blockquote")}
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setImage({ src: "https://placecats.com/800/700" })
              .run()
          }
        >
          <FontAwesomeIcon icon={faImage} />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          hr
        </button>
        <div className="colour-container">
          <button
            onClick={(event) => {
              setDisplayColourPicker(!displayColourPicker);
              event.currentTarget.classList.toggle("is-active");
            }}
            className={getClassFor("textStyle", { color: "#958DF1" })}
          >
            colour
          </button>
          {displayColourPicker ? (
            <div className="colour-picker-container">
              <HexColorPicker
                color={colour}
                onChange={(colour: string) => {
                  setColour(colour);
                  editor.chain().focus().setColor(colour).run();
                }}
                className="colour-picker"
              />
              <HexColorInput
                color={colour}
                onChange={(colour: string) => {
                  setColour(colour);
                  editor.chain().setColor(colour).run();
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
