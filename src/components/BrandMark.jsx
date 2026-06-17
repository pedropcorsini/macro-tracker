export default function BrandMark({ className = "" }) {
  return (
    <span className={["brand-mark", className].filter(Boolean).join(" ")} aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <rect className="brand-mark-frame" x="3.5" y="3.5" width="25" height="25" rx="8" />
        <path className="brand-mark-violet" d="M10 21.8V11.4c0-.7.8-1.1 1.34-.66l4.66 3.82 4.66-3.82c.54-.44 1.34-.05 1.34.66v10.4" />
        <path className="brand-mark-emerald" d="M10 21.8h12" />
        <path className="brand-mark-blue" d="M16 14.56v7.24" />
      </svg>
    </span>
  )
}
