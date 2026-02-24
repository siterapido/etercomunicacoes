"use client";

import { FileText, Image, Film, Music, File, Trash2, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  fileUrl: string;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
}

interface AttachmentListProps {
  attachments: Attachment[];
  onDelete?: (id: string, url: string) => void;
  className?: string;
}

function getFileIcon(fileType: string | null) {
  if (!fileType) return File;
  if (fileType.startsWith("image/")) return Image;
  if (fileType.startsWith("video/")) return Film;
  if (fileType.startsWith("audio/")) return Music;
  if (fileType.includes("pdf") || fileType.includes("document")) return FileText;
  return File;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPreviewable(fileType: string | null): boolean {
  if (!fileType) return false;
  return fileType.startsWith("image/");
}

export function AttachmentList({ attachments, onDelete, className }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {attachments.map((attachment) => {
        const Icon = getFileIcon(attachment.fileType);
        const showPreview = isPreviewable(attachment.fileType);

        return (
          <div
            key={attachment.id}
            className="group flex items-center gap-3 p-3 bg-charcoal border border-graphite rounded-lg hover:border-stone/40 transition-colors"
          >
            {showPreview ? (
              <div className="w-10 h-10 rounded-[2px] overflow-hidden flex-shrink-0 bg-graphite">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.fileUrl}
                  alt={attachment.fileName || "Preview"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-[2px] flex items-center justify-center bg-graphite flex-shrink-0">
                <Icon className="w-5 h-5 text-stone" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm text-champagne truncate">
                {attachment.fileName || "Arquivo"}
              </p>
              {attachment.fileSize && (
                <p className="text-[11px] text-stone">
                  {formatFileSize(attachment.fileSize)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-stone hover:text-champagne transition-colors"
                title="Abrir"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={attachment.fileUrl}
                download={attachment.fileName || undefined}
                className="p-1.5 text-stone hover:text-champagne transition-colors"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
              {onDelete && (
                <button
                  onClick={() => onDelete(attachment.id, attachment.fileUrl)}
                  className="p-1.5 text-stone hover:text-crimson transition-colors cursor-pointer"
                  title="Remover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
