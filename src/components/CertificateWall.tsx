"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Award } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { contentAssetUrl } from "@/lib/supabase/storage";

function isImage(path: string | null) {
  return Boolean(path && /\.(png|jpe?g|gif|webp)$/i.test(path));
}

export function CertificateWall({ certificates }: { certificates: Certificate[] }) {
  const [active, setActive] = useState<Certificate | null>(null);
  const activeUrl = active ? contentAssetUrl(active.file_path) : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, index) => {
          const fileUrl = contentAssetUrl(cert.file_path);
          return (
            <motion.button
              key={cert.id}
              type="button"
              onClick={() => setActive(cert)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              className="glass-panel group flex flex-col items-start overflow-hidden rounded-xl p-5 text-left transition hover:border-emerald/30"
            >
              <div className="relative mb-4 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-black/30">
                {fileUrl && isImage(cert.file_path) ? (
                  <Image src={fileUrl} alt={cert.title} fill className="object-contain p-3" />
                ) : (
                  <Award className="text-emerald" size={36} />
                )}
              </div>
              <h3 className="font-display text-sm font-semibold text-white">{cert.title}</h3>
              {cert.issuing_org && (
                <p className="mt-1 text-xs text-neutral-500">{cert.issuing_org}</p>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel relative w-full max-w-lg rounded-2xl p-6"
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {activeUrl && isImage(active.file_path) && (
                <div className="relative mb-5 h-48 w-full overflow-hidden rounded-lg bg-black/30">
                  <Image src={activeUrl} alt={active.title} fill className="object-contain" />
                </div>
              )}

              <h3 className="font-display text-xl font-semibold text-white">{active.title}</h3>
              {active.issuing_org && (
                <p className="mt-1 text-sm text-neutral-400">{active.issuing_org}</p>
              )}
              {active.issue_date && (
                <p className="mt-1 text-xs text-neutral-500">
                  Issued {new Date(active.issue_date).toLocaleDateString()}
                </p>
              )}
              {active.credential_id && (
                <p className="mt-3 text-xs text-neutral-500">
                  Credential ID: {active.credential_id}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {active.credential_url && (
                  <a
                    href={active.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald px-3 py-1.5 text-xs font-medium text-black transition hover:brightness-110"
                  >
                    <ExternalLink size={14} />
                    Verify Credential
                  </a>
                )}
                {activeUrl && (
                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/5"
                  >
                    View File
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
