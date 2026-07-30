import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Box,
  CheckSquare,
  ChevronDown,
  Code,
  Code2,
  Copy,
  Eraser,
  FileCode2,
  Heading,
  Highlighter,
  Image as ImageIcon,
  Indent,
  Info,
  Italic,
  Link,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Outdent,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Scissors,
  Search,
  Smile,
  SpellCheck2,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Type,
  Underline,
  Undo2,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type RichTextToolbarProps = {
  editor: Editor | null;
  onInsertImage: () => void;
  onInsertGallery: () => void;
  onInsertVideo: () => void;
  onFindReplace: () => void;
  onPlainPaste: () => void;
};

const fontFamilies = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  { label: "Nepali", value: "Mukta, Noto Sans Devanagari, sans-serif" },
];

const fontSizes = ["14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px"];
const lineHeights = ["1.2", "1.4", "1.6", "1.8", "2"];

export function RichTextToolbar({
  editor,
  onInsertImage,
  onInsertGallery,
  onInsertVideo,
  onFindReplace,
  onPlainPaste,
}: RichTextToolbarProps) {
  if (!editor) return null;

  const run = (callback: () => boolean) => {
    callback();
    editor.commands.focus();
  };

  return (
    <div className="rich-toolbar flex flex-wrap items-center gap-2 border-b border-border bg-slate-950/75 p-3">
      <ToolbarGroup>
        <ToolButton
          icon={Undo2}
          label="Undo"
          onClick={() => run(() => editor.chain().focus().undo().run())}
        />
        <ToolButton
          icon={Redo2}
          label="Redo"
          onClick={() => run(() => editor.chain().focus().redo().run())}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <select
          aria-label="Text style"
          className="rich-select w-36"
          value={getCurrentBlock(editor)}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "paragraph") run(() => editor.chain().focus().setParagraph().run());
            else {
              run(() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
                  .run(),
              );
            }
          }}
        >
          <option value="paragraph">Paragraph</option>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option key={level} value={level}>
              Heading {level}
            </option>
          ))}
        </select>
        <ToolButton
          icon={Bold}
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => run(() => editor.chain().focus().toggleBold().run())}
        />
        <ToolButton
          icon={Italic}
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => run(() => editor.chain().focus().toggleItalic().run())}
        />
        <ToolButton
          icon={Underline}
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}
        />
        <ToolButton
          icon={Link}
          label="Insert or edit link"
          active={editor.isActive("link")}
          onClick={() => run(() => editor.commands.openLinkDialog())}
        />
      </ToolbarGroup>

      <ToolbarMenu icon={Type} label="Typography">
        <DropdownMenuLabel>Font family</DropdownMenuLabel>
        {fontFamilies.map((font) => (
          <MenuItem
            key={font.label}
            icon={Type}
            label={font.label}
            onClick={() =>
              font.value
                ? run(() => editor.chain().focus().setFontFamily(font.value).run())
                : run(() => editor.chain().focus().unsetFontFamily().run())
            }
          />
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Font size</DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-1 p-1">
          {fontSizes.map((size) => (
            <button
              key={size}
              type="button"
              className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => run(() => editor.chain().focus().setFontSize(size).run())}
            >
              {size}
            </button>
          ))}
        </div>
        <DropdownMenuSeparator />
        <MenuItem
          icon={Strikethrough}
          label="Strike through"
          active={editor.isActive("strike")}
          onClick={() => run(() => editor.chain().focus().toggleStrike().run())}
        />
        <MenuItem
          icon={Superscript}
          label="Superscript"
          active={editor.isActive("superscript")}
          onClick={() => run(() => editor.chain().focus().toggleSuperscript().run())}
        />
        <MenuItem
          icon={Subscript}
          label="Subscript"
          active={editor.isActive("subscript")}
          onClick={() => run(() => editor.chain().focus().toggleSubscript().run())}
        />
        <MenuItem
          icon={Code}
          label="Inline code"
          active={editor.isActive("code")}
          onClick={() => run(() => editor.chain().focus().toggleCode().run())}
        />
        <MenuItem
          icon={RemoveFormatting}
          label="Remove formatting"
          onClick={() => run(() => editor.chain().focus().unsetAllMarks().clearNodes().run())}
        />
      </ToolbarMenu>

      <ToolbarMenu icon={Baseline} label="Colors">
        <ColorMenuItem
          label="Text color"
          icon={Baseline}
          onChange={(value) => run(() => editor.chain().focus().setColor(value).run())}
        />
        <ColorMenuItem
          label="Background color"
          icon={Highlighter}
          onChange={(value) => run(() => editor.chain().focus().setBackgroundColor(value).run())}
        />
        <ColorMenuItem
          label="Highlight color"
          icon={SpellCheck2}
          onChange={(value) =>
            run(() => editor.chain().focus().toggleHighlight({ color: value }).run())
          }
        />
      </ToolbarMenu>

      <ToolbarMenu icon={AlignLeft} label="Layout">
        <MenuItem
          icon={AlignLeft}
          label="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => run(() => editor.chain().focus().setTextAlign("left").run())}
        />
        <MenuItem
          icon={AlignCenter}
          label="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => run(() => editor.chain().focus().setTextAlign("center").run())}
        />
        <MenuItem
          icon={AlignRight}
          label="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => run(() => editor.chain().focus().setTextAlign("right").run())}
        />
        <MenuItem
          icon={AlignJustify}
          label="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => run(() => editor.chain().focus().setTextAlign("justify").run())}
        />
        <DropdownMenuSeparator />
        <MenuItem
          icon={Indent}
          label="Indent"
          onClick={() => run(() => editor.chain().focus().increaseIndent().run())}
        />
        <MenuItem
          icon={Outdent}
          label="Outdent"
          onClick={() => run(() => editor.chain().focus().decreaseIndent().run())}
        />
        <MenuItem
          icon={Pilcrow}
          label="Paragraph spacing"
          onClick={() => run(() => editor.chain().focus().toggleParagraphSpacing().run())}
        />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Line height</DropdownMenuLabel>
        <div className="grid grid-cols-3 gap-1 p-1">
          {lineHeights.map((height) => (
            <button
              key={height}
              type="button"
              className="rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => run(() => editor.chain().focus().setLineHeight(height).run())}
            >
              {height}
            </button>
          ))}
        </div>
        <DropdownMenuSeparator />
        <MenuItem
          icon={Pilcrow}
          label="Left to right"
          onClick={() => run(() => editor.chain().focus().setTextDirection("ltr").run())}
        />
        <MenuItem
          icon={Pilcrow}
          label="Right to left"
          onClick={() => run(() => editor.chain().focus().setTextDirection("rtl").run())}
        />
      </ToolbarMenu>

      <ToolbarMenu icon={List} label="Lists">
        <MenuItem
          icon={List}
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}
        />
        <MenuItem
          icon={ListOrdered}
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}
        />
        <MenuItem
          icon={CheckSquare}
          label="Checklist"
          active={editor.isActive("taskList")}
          onClick={() => run(() => editor.chain().focus().toggleTaskList().run())}
        />
      </ToolbarMenu>

      <ToolbarMenu icon={Box} label="Blocks">
        <MenuItem
          icon={Quote}
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => run(() => editor.chain().focus().toggleBlockquote().run())}
        />
        <MenuItem
          icon={Info}
          label="Information box"
          onClick={() => run(() => editor.chain().focus().insertInfoBox().run())}
        />
        <MenuItem
          icon={Eraser}
          label="Warning box"
          onClick={() => run(() => editor.chain().focus().insertWarningBox().run())}
        />
        <MenuItem
          icon={SpellCheck2}
          label="Success box"
          onClick={() => run(() => editor.chain().focus().insertSuccessBox().run())}
        />
        <MenuItem
          icon={FileCode2}
          label="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => run(() => editor.chain().focus().toggleCodeBlock().run())}
        />
        <MenuItem
          icon={Minus}
          label="Horizontal divider"
          onClick={() => run(() => editor.chain().focus().setHorizontalRule().run())}
        />
        <MenuItem
          icon={Heading}
          label="Read more break"
          onClick={() =>
            run(() => editor.chain().focus().insertContent('<hr data-break="read-more" />').run())
          }
        />
        <MenuItem
          icon={Heading}
          label="Page break"
          onClick={() =>
            run(() => editor.chain().focus().insertContent('<hr data-break="page" />').run())
          }
        />
      </ToolbarMenu>

      <ToolbarMenu icon={ImageIcon} label="Media">
        <MenuItem icon={ImageIcon} label="Insert / upload image" onClick={onInsertImage} />
        <MenuItem
          icon={ImageIcon}
          label="Insert multiple images / gallery"
          onClick={onInsertGallery}
        />
        <MenuItem icon={Video} label="YouTube, Vimeo, or uploaded video" onClick={onInsertVideo} />
        <DropdownMenuSeparator />
        <MenuItem
          icon={Link}
          label="Insert or edit link"
          active={editor.isActive("link")}
          onClick={() => run(() => editor.commands.openLinkDialog())}
        />
        <MenuItem
          icon={Link2Off}
          label="Remove link"
          onClick={() => run(() => editor.chain().focus().unsetLink().run())}
        />
      </ToolbarMenu>

      <ToolbarMenu icon={Table} label="Table">
        <MenuItem
          icon={Table}
          label="Insert table"
          onClick={() =>
            run(() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
            )
          }
        />
        <MenuItem
          icon={Table}
          label="Add row"
          onClick={() => run(() => editor.chain().focus().addRowAfter().run())}
        />
        <MenuItem
          icon={Table}
          label="Delete row"
          onClick={() => run(() => editor.chain().focus().deleteRow().run())}
        />
        <MenuItem
          icon={Table}
          label="Merge cells"
          onClick={() => run(() => editor.chain().focus().mergeCells().run())}
        />
        <MenuItem
          icon={Table}
          label="Split cell"
          onClick={() => run(() => editor.chain().focus().splitCell().run())}
        />
      </ToolbarMenu>

      <ToolbarMenu icon={Smile} label="Insert">
        <MenuItem
          icon={Smile}
          label="Emoji"
          onClick={() => run(() => editor.chain().focus().insertContent("🙂").run())}
        />
        <MenuItem
          icon={Code2}
          label="Special character ©"
          onClick={() => run(() => editor.chain().focus().insertContent("©").run())}
        />
        <MenuItem
          icon={Pilcrow}
          label="Date"
          onClick={() =>
            run(() => editor.chain().focus().insertContent(new Date().toLocaleDateString()).run())
          }
        />
        <MenuItem
          icon={Pilcrow}
          label="Time"
          onClick={() =>
            run(() => editor.chain().focus().insertContent(new Date().toLocaleTimeString()).run())
          }
        />
      </ToolbarMenu>

      <ToolbarMenu icon={Search} label="Tools">
        <MenuItem icon={Search} label="Find and replace" onClick={onFindReplace} />
        <MenuItem
          icon={Copy}
          label="Copy HTML"
          onClick={() => navigator.clipboard?.writeText(editor.getHTML())}
        />
        <MenuItem
          icon={Scissors}
          label="Cut selection"
          onClick={() => document.execCommand("cut")}
        />
        <MenuItem icon={Copy} label="Paste as plain text" onClick={onPlainPaste} />
        <DropdownMenuSeparator />
        <MenuItem
          icon={Code2}
          label="Clean HTML"
          onClick={() => run(() => editor.commands.cleanHtml())}
        />
      </ToolbarMenu>
    </div>
  );
}

function getCurrentBlock(editor: Editor) {
  for (const level of [1, 2, 3, 4, 5, 6]) {
    if (editor.isActive("heading", { level })) return String(level);
  }
  return "paragraph";
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/5 p-1">
      {children}
    </div>
  );
}

function ToolbarMenu({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rich-control flex w-auto gap-2 px-3">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-56 border-white/10 bg-slate-950/95 text-slate-100 shadow-[var(--shadow-elevated)] backdrop-blur-xl"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={cn(
        "cursor-pointer text-slate-200 focus:bg-cyan-400/15 focus:text-cyan-100",
        active && "bg-cyan-400/10 text-cyan-100",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </DropdownMenuItem>
  );
}

function ToolButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
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

function ColorMenuItem({
  label,
  icon: Icon,
  onChange,
}: {
  label: string;
  icon: LucideIcon;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm text-slate-200">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <input
        type="color"
        className="h-7 w-9 cursor-pointer rounded border border-white/10 bg-transparent"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
