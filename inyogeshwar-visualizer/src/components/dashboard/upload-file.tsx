"use client"

import * as React from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface UploadFileProps {
  label: string
  accept?: string
  onFileSelect?: (file: File | null) => void
  icon?: React.ReactNode
  className?: string
}

export function UploadFile({ label, accept, onFileSelect, icon, className }: UploadFileProps) {
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileSelect?.(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (!accept || file.type.startsWith(accept.split('/')[0]))) {
      setFileName(file.name)
      onFileSelect?.(file)
    }
  }

  const handleRemove = () => {
    setFileName(null)
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-white/90">{label}</label>
      <AnimatePresence mode="wait">
        {!fileName ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300",
                isDragging
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2 text-white/60">
                {icon || <Upload className="h-8 w-8" />}
                <span className="text-sm">Click or drag to upload</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-32 w-full items-center justify-between rounded-lg border border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                {icon || <Upload className="h-5 w-5 text-purple-400" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{fileName}</span>
                <span className="text-xs text-white/50">File uploaded successfully</span>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
