"use client";
import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

interface Props {
  onFileSelect: (f: File) => void;
  selectedFile: File | null;
  preview: string | null;
  onClear: () => void;
}

export function UploadDropzone({ onFileSelect, selectedFile, preview, onClear }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const validate = (f: File): string | null => {
    if (!ACCEPTED.includes(f.type)) return "Unsupported format. Please upload a JPG, PNG, or WebP file.";
    if (f.size > MAX_SIZE)          return "File too large. Maximum size is 10 MB.";
    return null;
  };

  const handle = useCallback((f: File) => {
    const err = validate(f);
    if (err) { setError(err); return; }
    setError(null);
    onFileSelect(f);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handle(f);
  }, [handle]);

  if (preview && selectedFile) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-card">
        <img src={preview} alt="Selected" className="w-full max-h-72 object-cover" />
        <Button variant="ghost" size="icon" onClick={onClear}
          className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
          aria-label="Remove image">
          <X className="w-4 h-4" />
        </Button>
        <div className="p-3 bg-card border-t border-border flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{selectedFile.name}</span>
          <span className="text-sm text-muted-foreground ml-auto">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        className={cn("flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50 hover:bg-muted/30")}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}>
        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center transition-colors", dragging ? "bg-primary/20" : "bg-muted")}>
          <Upload className={cn("w-6 h-6", dragging ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{dragging ? "Drop your image here" : "Drag & drop your image"}</p>
          <p className="text-sm text-muted-foreground mt-1">or <span className="text-primary">browse files</span></p>
        </div>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP · Max 10 MB</p>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
      </label>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}
