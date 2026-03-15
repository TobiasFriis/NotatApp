import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlock from "@tiptap/extension-code-block";
import DragHandle from "@tiptap/extension-drag-handle";
import Image from "@tiptap/extension-image";
import {
    CiTextAlignCenter,
    CiTextAlignLeft,
    CiTextAlignRight,
} from "react-icons/ci";
import { FaCode, FaListUl } from "react-icons/fa6";
import { IoCheckboxOutline } from "react-icons/io5";
import { FaListOl } from "react-icons/fa";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { AiOutlineCloseSquare } from "react-icons/ai";

import "../styling/TipTap.css";
import { useEffect, useRef, useState } from "react";
import type { Note } from "../types/Note";
import DeleteNoteModal from "./DeleteNoteModal";
import { TabIndent } from "./TabIndent";
import { MdDelete } from "react-icons/md";

type Props = {
    content: string;
    setContent: (html: string) => void;
    title: string;
    setTitle: (html: string) => void;
    setOpenNote: (html: Note | undefined) => void;
    openNote?: Note;
    setNoteChanged: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteNote: () => void;
    handleSaveNote: () => void;
};

const TipTapEditor: React.FC<Props> = ({
    content,
    setContent,
    title,
    setTitle,
    setOpenNote,
    openNote,
    handleDeleteNote,
    handleSaveNote,
}) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
            TabIndent,
            Image.configure({
                allowBase64: true,
                inline: true,
                resize: {
                    enabled: true,
                    directions: [
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                    ], // can be any direction or diagonal combination
                    minWidth: 50,
                    minHeight: 50,
                    alwaysPreserveAspectRatio: true,
                },
            }),
            DragHandle.configure({
                render: () => {
                    const handle = document.createElement("div");
                    handle.className = "custom-drag-handle";
                    handle.innerHTML = "⋮⋮";
                    return handle;
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    const editorRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        if (editorRef.current) {
            editorRef.current.scrollTop = 0;
        }
    };

    const handleCloseNote = async () => {
        handleSaveNote();
        setOpenNote(undefined);
        setTitle("");
        setContent("");
    };

    useEffect(() => {
        if (!editor) return;

        if (editor.getHTML() !== content) {
            editor.commands.setContent(content || "");
        }
    }, [content, editor]);

    useEffect(() => {
        scrollToTop();
    }, [openNote]);

    if (!editor) return null;

    return (
        <div className="tiptap-wrapper">
            {deleteModalOpen && (
                <DeleteNoteModal
                    modalOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    handleDeleteNote={handleDeleteNote}
                />
            )}
            <div className="tiptap-title-wrapper">
                <input
                    type="text"
                    className="tiptap-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button
                    onClick={handleCloseNote}
                    className="tiptap-close-button"
                >
                    <AiOutlineCloseSquare />
                </button>
                {openNote && (
                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="tiptap-delete-button"
                    >
                        <MdDelete />
                    </button>
                )}
            </div>
            <div className="tiptap-toolbar">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    I
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                >
                    U
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    S
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                >
                    <LuHeading1 />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    <LuHeading2 />
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <FaListUl />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <FaListOl />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleTaskList().run()
                    }
                >
                    <IoCheckboxOutline />
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                >
                    <FaCode />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                    }
                >
                    <CiTextAlignLeft />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                >
                    <CiTextAlignCenter />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                    }
                >
                    <CiTextAlignRight />
                </button>
            </div>
            <div
                ref={editorRef}
                className="editor-wrapper"
                onKeyDown={(e) => {
                    if (e.key === "Tab") {
                        e.preventDefault();
                    }
                }}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default TipTapEditor;
