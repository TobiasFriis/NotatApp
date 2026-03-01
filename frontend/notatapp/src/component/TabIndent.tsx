import { Extension } from "@tiptap/core";

export const TabIndent = Extension.create({
    name: "tabIndent",

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                if (
                    this.editor.isActive("bulletList") ||
                    this.editor.isActive("orderedList")
                ) {
                    return false; // la TipTap håndtere indent
                }
                this.editor.commands.insertContent("    ");
                return true;
            },
        };
    },
});
