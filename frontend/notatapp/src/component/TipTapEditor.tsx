import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlock from "@tiptap/extension-code-block";

import "../styling/TipTap.css";
import { useEffect } from "react";
import type { Note } from "../types/Note";

type Props = {
  content: string;
  setContent: (html: string) => void;
  title: string;
  setTitle: (html: string) => void;
  setOpenNote: (html: Note | undefined) => void;
  setNoteChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const TipTapEditor: React.FC<Props> = ({ content, setContent, title, setTitle, setOpenNote, setNoteChanged }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlock,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleCloseNote = async () => {
    await setOpenNote(undefined)
    await setTitle("")
    await setContent("")
  }

  useEffect(() => {
    if (!editor) return

    // Unngå å overskrive mens man skriver
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  if (!editor) return null;

  return (
    <div className="tiptap-wrapper">
      <div className="tiptap-title-wrapper">
        <input type="text" className="tiptap-title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={handleCloseNote}>Close note</button>
      </div>
      <div className="tiptap-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()}>☑</button>

        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</button>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>⬅</button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>↔</button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>➡</button>
      </div>
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;
