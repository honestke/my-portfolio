"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";

type Props = {
  name: string;
  label: string;
  accept?: Accept;
  existingUrl?: string | null;
  removeFieldName?: string;
};

export function FileDropzone({
  name,
  label,
  accept,
  existingUrl,
  removeFieldName,
}: Props) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [markRemoved, setMarkRemoved] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !hiddenInputRef.current) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    hiddenInputRef.current.files = dataTransfer.files;

    setFileName(file.name);
    setMarkRemoved(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept,
  });

  return (
    <div>
      <label className="mb-1 block text-sm text-neutral-300">{label}</label>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-md border-2 border-dashed px-4 py-6 text-center text-sm transition ${
          isDragActive
            ? "border-blue-500 bg-blue-950/30 text-blue-300"
            : "border-neutral-700 text-neutral-400 hover:border-neutral-600"
        }`}
      >
        <input {...getInputProps()} />
        <p className={fileName ? "text-white" : undefined}>
          {fileName ?? "Drag & drop a file here, or click to browse"}
        </p>
      </div>

      <input
        ref={hiddenInputRef}
        type="file"
        name={name}
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />

      {existingUrl && !fileName && (
        <div className="mt-2 flex items-center gap-4">
          <a
            href={existingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-400 underline"
          >
            View current file
          </a>
          {removeFieldName && (
            <label className="flex items-center gap-1 text-xs text-neutral-400">
              <input
                type="checkbox"
                name={removeFieldName}
                checked={markRemoved}
                onChange={(e) => setMarkRemoved(e.target.checked)}
              />
              Remove on save
            </label>
          )}
        </div>
      )}
    </div>
  );
}
