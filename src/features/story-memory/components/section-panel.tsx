import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function SectionPanel({
  children,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-zinc-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}
