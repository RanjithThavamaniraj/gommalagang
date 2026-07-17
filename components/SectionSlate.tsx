type SectionSlateProps = {
  code: string;
  label: string;
};

/** Film-slate style section marker: registration mark + index code + label. */
export function SectionSlate({ code, label }: SectionSlateProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span aria-hidden className="reg-mark shrink-0" />
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gg-primary">
        {code}
        <span className="mx-3 text-gg-text/40">·</span>
        <span className="text-gg-text/65">{label}</span>
      </p>
      <span aria-hidden className="h-px flex-1 bg-gg-hairline" />
    </div>
  );
}
