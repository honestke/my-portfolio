export type FileTypeInfo = {
  label: string;
  color: string;
};

const FILE_TYPES: Record<string, FileTypeInfo> = {
  xlsx: { label: "Excel", color: "#217346" },
  xls: { label: "Excel", color: "#217346" },
  csv: { label: "CSV", color: "#217346" },
  accdb: { label: "Access", color: "#A4373A" },
  mdb: { label: "Access", color: "#A4373A" },
  pdf: { label: "PDF", color: "#DC2626" },
  doc: { label: "Word", color: "#2B579A" },
  docx: { label: "Word", color: "#2B579A" },
  ppt: { label: "PowerPoint", color: "#D24726" },
  pptx: { label: "PowerPoint", color: "#D24726" },
  pbix: { label: "Power BI", color: "#F2C811" },
};

export function getFileTypeInfo(path: string | null): FileTypeInfo | null {
  if (!path) return null;
  const ext = path.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  return FILE_TYPES[ext] ?? null;
}
