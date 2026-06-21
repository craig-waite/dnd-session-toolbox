import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components: Components = {
  p: ({ children }) => (
    <p className="mb-2 text-sm leading-relaxed text-muted-foreground last:mb-0">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h1 className="mt-3 mb-1 text-base font-semibold text-foreground first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-3 mb-1 text-sm font-semibold text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1 text-xs font-semibold tracking-wide text-foreground uppercase first:mt-0">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc pl-4 text-sm leading-relaxed text-muted-foreground last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal pl-4 text-sm leading-relaxed text-muted-foreground last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  a: ({ children, href }) => (
    <a href={href} className="text-primary underline-offset-2 hover:underline">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="w-full text-left text-sm text-muted-foreground">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b">{children}</thead>,
  tr: ({ children }) => <tr className="border-b last:border-0">{children}</tr>,
  th: ({ children }) => (
    <th className="py-1 pr-2 font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => <td className="py-1 pr-2">{children}</td>,
}

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}

const TABLE_ROW_PATTERN = /^\s*\|.*\|\s*$/

/**
 * SRD `desc` arrays split each line as a separate string, including markdown
 * table header/separator/body rows. GFM tables only parse when those rows are
 * contiguous lines in one markdown document, so table-row lines must be joined
 * with single newlines while ordinary paragraphs stay separated by blank lines.
 */
export function joinDescription(desc: string[]): string {
  return desc
    .map((line, i) => {
      if (i === 0) return line
      const prev = desc[i - 1]
      const sameTable =
        TABLE_ROW_PATTERN.test(line) && TABLE_ROW_PATTERN.test(prev)
      return (sameTable ? '\n' : '\n\n') + line
    })
    .join('')
}
