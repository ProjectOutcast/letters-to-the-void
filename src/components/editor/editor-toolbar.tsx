"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface ToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      editor.chain().focus().setImage({ src: data.url }).run();
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addLink() {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  const groups = [
    [
      {
        label: "B",
        title: "Bold",
        action: () => editor.chain().focus().toggleBold().run(),
        active: editor.isActive("bold"),
        className: "font-bold",
      },
      {
        label: "I",
        title: "Italic",
        action: () => editor.chain().focus().toggleItalic().run(),
        active: editor.isActive("italic"),
        className: "italic",
      },
      {
        label: "S",
        title: "Strikethrough",
        action: () => editor.chain().focus().toggleStrike().run(),
        active: editor.isActive("strike"),
        className: "line-through",
      },
    ],
    [
      {
        label: "H2",
        title: "Heading 2",
        action: () =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
        active: editor.isActive("heading", { level: 2 }),
      },
      {
        label: "H3",
        title: "Heading 3",
        action: () =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
        active: editor.isActive("heading", { level: 3 }),
      },
    ],
    [
      {
        label: "❝",
        title: "Blockquote",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        active: editor.isActive("blockquote"),
      },
      {
        label: "—",
        title: "Horizontal Rule",
        action: () => editor.chain().focus().setHorizontalRule().run(),
        active: false,
      },
      {
        label: "•",
        title: "Bullet List",
        action: () => editor.chain().focus().toggleBulletList().run(),
        active: editor.isActive("bulletList"),
      },
      {
        label: "1.",
        title: "Ordered List",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        active: editor.isActive("orderedList"),
      },
    ],
    [
      {
        label: "</>",
        title: "Code Block",
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        active: editor.isActive("codeBlock"),
      },
      {
        label: "🔗",
        title: "Link",
        action: addLink,
        active: editor.isActive("link"),
      },
      {
        label: "📷",
        title: "Image",
        action: () => fileInputRef.current?.click(),
        active: false,
      },
    ],
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-void-border px-2 py-1.5">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && (
            <div className="mx-1 h-5 w-px bg-void-border" />
          )}
          {group.map((btn) => (
            <button
              key={btn.title}
              type="button"
              onClick={btn.action}
              title={btn.title}
              className={cn(
                "rounded px-2 py-1 text-xs transition-colors",
                btn.active
                  ? "bg-void-elevated text-void-heading"
                  : "text-void-muted hover:bg-void-elevated hover:text-void-text",
                "className" in btn && btn.className
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ))}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
