import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { AlertCircle, CheckCircle2, Info, Monitor, Smartphone, Tablet, Upload } from "lucide-react";
import { toast } from "sonner";
import { RichTextToolbar } from "./RichTextToolbar";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  nepali?: boolean;
  uploadImage: (file: File) => Promise<string>;
  internalLinks?: string[];
};

type PreviewMode = "desktop" | "tablet" | "mobile";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
    boxBlocks: {
      insertInfoBox: () => ReturnType;
      insertWarningBox: () => ReturnType;
      insertSuccessBox: () => ReturnType;
    };
    directionAndSpacing: {
      setTextDirection: (direction: "ltr" | "rtl") => ReturnType;
      setLineHeight: (lineHeight: string) => ReturnType;
      setBackgroundColor: (color: string) => ReturnType;
      increaseIndent: () => ReturnType;
      decreaseIndent: () => ReturnType;
      toggleParagraphSpacing: () => ReturnType;
    };
    editorUtilities: {
      cleanHtml: () => ReturnType;
      openLinkDialog: () => ReturnType;
    };
  }
}

const lowlight = createLowlight(all);

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
    };
  },
});

const DirectionAndSpacing = Extension.create({
  name: "directionAndSpacing",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) => element.getAttribute("dir"),
            renderHTML: (attributes) => (attributes.dir ? { dir: attributes.dir } : {}),
          },
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight,
            renderHTML: (attributes) =>
              attributes.lineHeight ? { style: `line-height: ${attributes.lineHeight}` } : {},
          },
          textIndent: {
            default: 0,
            parseHTML: (element) => Number(element.getAttribute("data-indent") ?? 0),
            renderHTML: (attributes) =>
              attributes.textIndent
                ? {
                    "data-indent": attributes.textIndent,
                    style: `padding-left: ${Number(attributes.textIndent) * 1.5}rem`,
                  }
                : {},
          },
          paragraphSpacing: {
            default: false,
            parseHTML: (element) => element.getAttribute("data-paragraph-spacing") === "true",
            renderHTML: (attributes) =>
              attributes.paragraphSpacing
                ? { "data-paragraph-spacing": "true", style: "margin-bottom: 1.5rem" }
                : {},
          },
        },
      },
      {
        types: ["textStyle"],
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor,
            renderHTML: (attributes) =>
              attributes.backgroundColor
                ? { style: `background-color: ${attributes.backgroundColor}` }
                : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTextDirection:
        (direction) =>
        ({ commands }) =>
          commands.updateAttributes("paragraph", { dir: direction }) ||
          commands.updateAttributes("heading", { dir: direction }),
      setLineHeight:
        (lineHeight) =>
        ({ commands }) =>
          commands.updateAttributes("paragraph", { lineHeight }) ||
          commands.updateAttributes("heading", { lineHeight }),
      setBackgroundColor:
        (color) =>
        ({ chain }) =>
          chain().setMark("textStyle", { backgroundColor: color }).run(),
      increaseIndent:
        () =>
        ({ editor, commands }) => {
          const current = Number(
            editor.getAttributes("paragraph").textIndent ||
              editor.getAttributes("heading").textIndent ||
              0,
          );
          return commands.updateAttributes("paragraph", { textIndent: Math.min(current + 1, 8) });
        },
      decreaseIndent:
        () =>
        ({ editor, commands }) => {
          const current = Number(
            editor.getAttributes("paragraph").textIndent ||
              editor.getAttributes("heading").textIndent ||
              0,
          );
          return commands.updateAttributes("paragraph", { textIndent: Math.max(current - 1, 0) });
        },
      toggleParagraphSpacing:
        () =>
        ({ editor, commands }) => {
          const current = Boolean(editor.getAttributes("paragraph").paragraphSpacing);
          return commands.updateAttributes("paragraph", { paragraphSpacing: !current });
        },
    };
  },
});

const BoxBlocks = Extension.create({
  name: "boxBlocks",
  addCommands() {
    const box = (type: "info" | "warning" | "success", title: string) =>
      `<aside class="content-box content-box-${type}"><strong>${title}</strong><p>Write the message here.</p></aside><p></p>`;
    return {
      insertInfoBox:
        () =>
        ({ chain }) =>
          chain().focus().insertContent(box("info", "Information")).run(),
      insertWarningBox:
        () =>
        ({ chain }) =>
          chain().focus().insertContent(box("warning", "Warning")).run(),
      insertSuccessBox:
        () =>
        ({ chain }) =>
          chain().focus().insertContent(box("success", "Success")).run(),
    };
  },
});

const EditorUtilities = Extension.create({
  name: "editorUtilities",
  addCommands() {
    return {
      cleanHtml:
        () =>
        ({ editor }) => {
          editor.commands.setContent(cleanHtml(editor.getHTML()));
          return true;
        },
      openLinkDialog: () => () => {
        window.dispatchEvent(new CustomEvent("rich-text-open-link-dialog"));
        return true;
      },
    };
  },
});

const imageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: null },
      title: { default: null },
      loading: { default: "lazy" },
      width: { default: null },
      class: { default: null },
    };
  },
}).configure({ inline: false, allowBase64: false });

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder,
  className,
  nepali,
  uploadImage,
  internalLinks = [],
}: RichTextEditorProps) {
  const [preview, setPreview] = useState<PreviewMode>("desktop");
  const [sourceMode, setSourceMode] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkNewTab, setLinkNewTab] = useState(true);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      FontSize,
      DirectionAndSpacing,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Superscript,
      Subscript,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      imageExtension,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Typography,
      CodeBlockLowlight.configure({ lowlight }),
      BoxBlocks,
      EditorUtilities,
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "rich-editor-content min-h-[420px] px-5 py-4 outline-none",
          nepali && "font-nepali",
        ),
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
          file.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        void insertFiles(files);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
          file.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        void insertFiles(files);
        return true;
      },
    },
    onUpdate: ({ editor: nextEditor }) => onChange(cleanHtml(nextEditor.getHTML())),
  });

  useEffect(() => {
    if (!editor || value === editor.getHTML()) return;
    editor.commands.setContent(value || "", false);
  }, [editor, value]);

  useEffect(() => {
    const openLinkDialog = () => {
      const previous = editor?.getAttributes("link").href as string | undefined;
      const selectionText = editor?.state.selection.textContent ?? "";
      setLinkUrl(previous ?? "");
      setLinkText(selectionText || "");
      setLinkNewTab(previous ? editor?.getAttributes("link").target === "_blank" : true);
      setLinkDialogOpen(true);
    };

    window.addEventListener("rich-text-open-link-dialog", openLinkDialog);
    return () => window.removeEventListener("rich-text-open-link-dialog", openLinkDialog);
  }, [editor]);

  const stats = useMemo(() => getContentStats(value), [value]);
  const seo = useMemo(() => getSeoChecks(value), [value]);
  const previewClass =
    preview === "mobile" ? "max-w-sm" : preview === "tablet" ? "max-w-2xl" : "max-w-none";

  async function insertFiles(files: File[]) {
    if (!editor) return;
    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`${file.name} is not a supported image type`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} must be under 5 MB`);
        continue;
      }
      try {
        const src = await uploadImage(file);
        editor
          .chain()
          .focus()
          .insertContent(
            `<figure class="media media-center"><img src="${src}" alt="${escapeHtml(file.name.replace(/\.[^.]+$/, ""))}" loading="lazy" /></figure><p></p>`,
          )
          .run();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Image upload failed");
      }
    }
  }

  async function handleImageUpload(file: File) {
    if (!editor) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are supported");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setImageUploadProgress("Uploading...");
    try {
      const src = await uploadImage(file);
      setImageUrl(src);
      setImageAlt(file.name.replace(/\.[^.]+$/, ""));
      setImageUploadProgress("Ready to insert");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
      setImageUploadProgress("");
    }
  }

  function insertImageFromDialog() {
    if (!editor || !imageUrl) {
      toast.error("Please add an image URL or upload one first");
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent(
        `<figure class="media media-center"><img src="${imageUrl}" alt="${escapeHtml(imageAlt)}" loading="lazy" /></figure><p></p>`,
      )
      .run();
    setImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
    setImageUploadProgress("");
  }

  function insertLinkFromDialog() {
    if (!editor) return;
    const trimmedUrl = linkUrl.trim();
    if (!trimmedUrl) {
      toast.error("Please enter a URL");
      return;
    }

    const href =
      trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")
        ? trimmedUrl
        : `https://${trimmedUrl}`;
    const displayText = linkText.trim() || href;
    const attributes = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";

    editor
      .chain()
      .focus()
      .insertContent(`<a href="${escapeHtml(href)}"${attributes}>${escapeHtml(displayText)}</a>`)
      .run();
    setLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
    setLinkNewTab(true);
  }

  function insertVideo() {
    if (!editor) return;
    const url = window.prompt("YouTube, Vimeo, or uploaded video URL");
    if (!url) return;
    const embed = getVideoEmbed(url);
    editor.chain().focus().insertContent(embed).run();
  }

  function insertGallery() {
    imageFileRef.current?.click();
  }

  function findReplace() {
    if (!editor) return;
    const find = window.prompt("Find text");
    if (!find) return;
    const replace = window.prompt("Replace with", "") ?? "";
    editor.commands.setContent(cleanHtml(editor.getHTML()).replaceAll(find, replace));
  }

  async function pastePlainText() {
    if (!editor) return;
    const text = await navigator.clipboard?.readText();
    if (text) editor.chain().focus().insertContent(escapeHtml(text)).run();
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="sticky top-0 z-40 border-b border-border bg-slate-950/95 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">{label}</p>

            <p className="mt-1 text-xs text-slate-400">
              {stats.words} words · {stats.characters} characters · clean HTML
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            <PreviewButton
              active={preview === "desktop"}
              icon={Monitor}
              label="Desktop preview"
              onClick={() => setPreview("desktop")}
            />

            <PreviewButton
              active={preview === "tablet"}
              icon={Tablet}
              label="Tablet preview"
              onClick={() => setPreview("tablet")}
            />

            <PreviewButton
              active={preview === "mobile"}
              icon={Smartphone}
              label="Mobile preview"
              onClick={() => setPreview("mobile")}
            />

            <button
              type="button"
              className="rich-control px-3"
              onClick={() => setSourceMode((open) => !open)}
            >
              HTML
            </button>
          </div>
        </div>

        <RichTextToolbar
          editor={editor}
          onInsertImage={() => setImageDialogOpen(true)}
          onInsertGallery={insertGallery}
          onInsertVideo={insertVideo}
          onFindReplace={findReplace}
          onPlainPaste={pastePlainText}
        />
      </div>

      <input
        ref={imageFileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          void insertFiles(files);
          event.target.value = "";
        }}
      />

      {imageDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Insert image</p>
                <p className="text-sm text-muted-foreground">
                  Upload a file or paste an image URL to add it to the editor.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
                onClick={() => setImageDialogOpen(false)}
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  onClick={() => imageFileRef.current?.click()}
                >
                  Upload Image
                </button>
                <span className="text-sm text-muted-foreground">
                  {imageUploadProgress || "JPEG, PNG, or WebP • max 5MB"}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="image-url">
                  Image URL
                </label>
                <input
                  id="image-url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  className="input w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="image-alt">
                  Alt text
                </label>
                <input
                  id="image-alt"
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  className="input w-full"
                  placeholder="Descriptive alt text"
                />
              </div>

              {imageUrl ? (
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">Preview</p>
                  <img
                    src={imageUrl}
                    alt={imageAlt || "Preview"}
                    className="max-h-48 w-full rounded-lg object-contain"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                onClick={() => {
                  setImageDialogOpen(false);
                  setImageUrl("");
                  setImageAlt("");
                  setImageUploadProgress("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white"
                onClick={insertImageFromDialog}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {linkDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Insert link</p>
                <p className="text-sm text-muted-foreground">
                  Add a URL and optional display text.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
                onClick={() => setLinkDialogOpen(false)}
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="link-url">
                  URL
                </label>
                <input
                  id="link-url"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  className="input w-full"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="link-text">
                  Display text
                </label>
                <input
                  id="link-text"
                  value={linkText}
                  onChange={(event) => setLinkText(event.target.value)}
                  className="input w-full"
                  placeholder="Visible link text"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(event) => setLinkNewTab(event.target.checked)}
                />
                Open in new tab
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                onClick={() => {
                  setLinkDialogOpen(false);
                  setLinkUrl("");
                  setLinkText("");
                  setLinkNewTab(true);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white"
                onClick={insertLinkFromDialog}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background/45 p-3">
        {sourceMode ? (
          <textarea
            value={value}
            onChange={(event) => onChange(cleanHtml(event.target.value))}
            className="input min-h-[420px] w-full font-mono text-sm"
            spellCheck={false}
          />
        ) : (
          <div
            className={cn(
              "mx-auto rounded-xl border border-white/8 bg-slate-950/45 transition-all",
              previewClass,
            )}
          >
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      <div className="grid gap-3 border-t border-border bg-slate-950/60 p-4 text-xs text-slate-300 md:grid-cols-3">
        <SeoItem ok={seo.headingStructure} text="Heading structure" />
        <SeoItem ok={seo.externalLinksValid} text="External links valid" />
        <SeoItem ok={seo.imagesHaveAlt} text="Image alt text" />
        <SeoItem
          ok={internalLinks.length > 0 || seo.internalLinks > 0}
          text={`Internal links: ${seo.internalLinks || internalLinks.length}`}
        />
        <SeoItem ok={seo.embedsResponsive} text="Responsive media" />
        <SeoItem ok={seo.tablesResponsive} text="Tables supported" />
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-cyan-400/5 px-4 py-3 text-xs text-cyan-100/80">
        <Upload className="h-4 w-4" />
        Drag and drop images into the editor, or use the image button for uploads.
      </div>
    </section>
  );
}

function PreviewButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Monitor;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn("rich-control", active && "border-cyan-300/45 bg-cyan-400/20 text-cyan-100")}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function SeoItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2",
        ok
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
          : "border-amber-400/20 bg-amber-400/10 text-amber-100",
      )}
    >
      {ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {text}
    </div>
  );
}

function getContentStats(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    words: text ? text.split(" ").length : 0,
    characters: text.length,
  };
}

function getSeoChecks(html: string) {
  if (typeof DOMParser === "undefined") {
    return {
      headingStructure: true,
      imagesHaveAlt: true,
      externalLinksValid: true,
      internalLinks: 0,
      embedsResponsive: true,
      tablesResponsive: true,
    };
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  const levels = headings.map((heading) => Number(heading.tagName.slice(1)));
  const headingStructure = levels.every(
    (level, index) => index === 0 || level - levels[index - 1] <= 1,
  );
  const imagesHaveAlt = Array.from(doc.images).every((image) => image.alt.trim().length > 0);
  const anchors = Array.from(doc.querySelectorAll("a[href]"));
  const externalLinksValid = anchors.every((anchor) => {
    const href = anchor.getAttribute("href") ?? "";
    return href.startsWith("/") || href.startsWith("#") || /^https?:\/\//.test(href);
  });
  return {
    headingStructure,
    imagesHaveAlt,
    externalLinksValid,
    internalLinks: anchors.filter((anchor) => (anchor.getAttribute("href") ?? "").startsWith("/"))
      .length,
    embedsResponsive: Array.from(doc.querySelectorAll("iframe,video")).every((node) =>
      node.closest("figure,.video-embed"),
    ),
    tablesResponsive: true,
  };
}

function getVideoEmbed(url: string) {
  const safeUrl = escapeHtml(url.trim());
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (youtube) {
    return `<figure class="video-embed"><iframe src="https://www.youtube.com/embed/${youtube[1]}" title="YouTube video" loading="lazy" allowfullscreen></iframe></figure><p></p>`;
  }
  if (vimeo) {
    return `<figure class="video-embed"><iframe src="https://player.vimeo.com/video/${vimeo[1]}" title="Vimeo video" loading="lazy" allowfullscreen></iframe></figure><p></p>`;
  }
  return `<figure class="video-embed"><video controls preload="metadata" src="${safeUrl}"></video></figure><p></p>`;
}

function cleanHtml(html: string) {
  return html
    .replace(/<p><\/p>/g, "")
    .replace(/\sdata-pm-slice="[^"]*"/g, "")
    .replace(/\scontenteditable="[^"]*"/g, "")
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
