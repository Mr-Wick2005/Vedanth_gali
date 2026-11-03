'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'min-h-[140px] px-3.5 py-2.5 focus:outline-none text-sm text-slate-200 leading-relaxed font-sans',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // Synchronize incoming value if changed externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor) {
    return (
      <div className="h-[180px] w-full animate-pulse rounded-lg border border-white/10 bg-black/40 p-4" />
    )
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-white/10 bg-[#080b12] ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.08] bg-[#0d111c] px-2 py-1.5 font-mono text-xs text-slate-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('bold') ? 'bg-blue-600/40 text-blue-300 font-bold' : ''
          }`}
          title="Bold"
        >
          <Bold size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('italic') ? 'bg-blue-600/40 text-blue-300 italic' : ''
          }`}
          title="Italic"
        >
          <Italic size={14} />
        </button>

        <span className="mx-1 h-4 w-[1px] bg-white/10" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-600/40 text-blue-300' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-600/40 text-blue-300' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>

        <span className="mx-1 h-4 w-[1px] bg-white/10" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('bulletList') ? 'bg-blue-600/40 text-blue-300' : ''
          }`}
          title="Bullet List"
        >
          <List size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('orderedList') ? 'bg-blue-600/40 text-blue-300' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('code') ? 'bg-blue-600/40 text-blue-300' : ''
          }`}
          title="Code"
        >
          <Code size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
            editor.isActive('blockquote') ? 'bg-blue-600/40 text-blue-300' : ''
          }`}
          title="Quote"
        >
          <Quote size={14} />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded p-1.5 transition-colors hover:bg-white/10 disabled:opacity-30"
            title="Undo"
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded p-1.5 transition-colors hover:bg-white/10 disabled:opacity-30"
            title="Redo"
          >
            <Redo size={14} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <EditorContent editor={editor} />
    </div>
  )
}
