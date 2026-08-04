"use client";

import { useRef, useState, useTransition } from "react";
import {
  Bold,
  Italic,
  Code,
  Table,
  Image as ImageIcon,
  Video,
  FileText,
  Paperclip,
  Eye,
  Pencil,
} from "lucide-react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { uploadInlineAsset } from "../actions";

type Props = {
  name: string;
  defaultValue?: string;
};

const TOOLBAR_BUTTON =
  "inline-flex items-center justify-center rounded-md p-2 text-neutral-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50";

export function MarkdownEditor({ name, defaultValue = "" }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [isPending, startTransition] = useTransition();

  function insertAtCursor(snippet: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setValue((v) => v + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = value.slice(0, start) + snippet + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  function wrapSelection(before: string, after: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return uploadInlineAsset(formData);
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    startTransition(async () => {
      const result = await handleUpload(file);
      if ("url" in result) {
        insertAtCursor(`\n![${file.name}](${result.url})\n`);
      }
    });
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    startTransition(async () => {
      const result = await handleUpload(file);
      if ("url" in result) {
        insertAtCursor(`\n[[file:${result.url}|${file.name}]]\n`);
      }
    });
  }

  function handlePdfPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    startTransition(async () => {
      const result = await handleUpload(file);
      if ("url" in result) {
        insertAtCursor(`\n[[pdf:${result.url}|${file.name}]]\n`);
      }
    });
  }

  function handleYoutubeInsert() {
    const url = window.prompt("Paste a YouTube URL");
    if (url) insertAtCursor(`\n[[youtube:${url}]]\n`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-neutral-700 bg-neutral-900 p-1.5">
        <button type="button" className={TOOLBAR_BUTTON} onClick={() => wrapSelection("**", "**")} title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" className={TOOLBAR_BUTTON} onClick={() => wrapSelection("_", "_")} title="Italic">
          <Italic size={16} />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON}
          onClick={() => insertAtCursor("\n```\ncode\n```\n")}
          title="Code block"
        >
          <Code size={16} />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON}
          onClick={() =>
            insertAtCursor(
              "\n| Column 1 | Column 2 |\n| --- | --- |\n| Value | Value |\n",
            )
          }
          title="Table"
        >
          <Table size={16} />
        </button>

        <span className="mx-1 h-5 w-px bg-neutral-700" />

        <button
          type="button"
          className={TOOLBAR_BUTTON}
          disabled={isPending}
          onClick={() => imageInputRef.current?.click()}
          title="Insert image"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON}
          disabled={isPending}
          onClick={() => pdfInputRef.current?.click()}
          title="Insert PDF"
        >
          <FileText size={16} />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON}
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
          title="Insert downloadable file"
        >
          <Paperclip size={16} />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON}
          onClick={handleYoutubeInsert}
          title="Embed YouTube video"
        >
          <Video size={16} />
        </button>

        <span className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`${TOOLBAR_BUTTON} ${mode === "write" ? "bg-white/10 text-white" : ""}`}
            title="Write"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`${TOOLBAR_BUTTON} ${mode === "preview" ? "bg-white/10 text-white" : ""}`}
            title="Preview"
          >
            <Eye size={16} />
          </button>
        </span>
      </div>

      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={18}
          className="w-full rounded-b-md border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-sm text-white outline-none focus:border-blue-500"
        />
      ) : (
        <div className="rounded-b-md border border-neutral-700 bg-neutral-950 px-4 py-4">
          <MarkdownContent content={value || "*Nothing to preview yet.*"} />
        </div>
      )}

      {/* Always present so the current content submits regardless of write/preview mode. */}
      <textarea name={name} value={value} readOnly hidden />

      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFilePick} />
      <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfPick} />
    </div>
  );
}
