"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StudioShellProps {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

const primarySections = [
  {
    description: "Overview, imports, native bridge, and workflow status.",
    href: "/",
    icon: "/brand/favicon.svg",
    label: "Dashboard",
  },
  {
    description: "Generate, import, edit, convert, and export CCV3 cards.",
    href: "/workspace",
    icon: "/brand/icons/character-cards.svg",
    label: "Character Cards",
  },
  {
    description: "Craft standalone personas or match them to generated cards.",
    href: "/?section=personas",
    icon: "/brand/icons/persona-matching.svg",
    label: "Persona Matching",
  },
  {
    description: "Build scoped world, character, and scenario lorebooks.",
    href: "/?section=lorebooks",
    icon: "/brand/icons/lorebooks.svg",
    label: "Lorebooks",
  },
  {
    description: "Generate and process card art and visual assets.",
    href: "/?section=images",
    icon: "/brand/icons/image-generation.svg",
    label: "Image Generation",
  },
  {
    description: "Run private one-on-one romance roleplay previews.",
    href: "/chat",
    icon: "/brand/icons/character-chat.svg",
    label: "Character Chat",
  },
  {
    description: "Stage multi-character room and ensemble openings.",
    href: "/?section=group-chat",
    icon: "/brand/icons/group-chat.svg",
    label: "Group Chat",
  },
];

const utilitySections = [
  {
    href: "/?section=conversion",
    icon: "/brand/icons/card-conversion.svg",
    label: "V1/V2 to V3",
  },
  {
    href: "/?section=settings",
    icon: "/brand/icons/settings.svg",
    label: "Settings",
  },
];

export function StudioShell({
  actions,
  children,
  eyebrow = "HeartWriteAI Studio",
  title,
  subtitle,
}: StudioShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="amour-studio-ambient pointer-events-none fixed inset-0 -z-10" />
      <div className="grid min-h-screen lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden border-r bg-card/90 shadow-2xl backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b px-5 py-5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 shadow-inner dark:bg-rose-950/30">
              <Image
                src="/brand/brand-mark.svg"
                alt=""
                width={36}
                height={36}
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight">
                HeartWriteAI
              </p>
              <p className="text-xs text-muted-foreground">
                Romance creation suite
              </p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
            <div className="space-y-1">
              {primarySections.map((section) => (
                <StudioNavLink
                  key={section.label}
                  active={section.href === pathname}
                  description={section.description}
                  href={section.href}
                  icon={section.icon}
                  label={section.label}
                />
              ))}
            </div>

            <div className="mt-auto space-y-2">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Tools
              </p>
              <div className="space-y-1">
                {utilitySections.map((section) => (
                  <StudioNavLink
                    key={section.label}
                    active={false}
                    href={section.href}
                    icon={section.icon}
                    label={section.label}
                    compact
                  />
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b bg-background/85 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/brand/brand-mark.svg"
                  alt=""
                  width={34}
                  height={34}
                  className="lg:hidden"
                  priority
                />
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      {eyebrow}
                    </Badge>
                  </div>
                  <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="mt-1 max-w-3xl truncate text-sm text-muted-foreground">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {actions}
                <ModeToggle />
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {[...primarySections, ...utilitySections].map((section) => (
                <Link
                  key={section.label}
                  href={section.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs font-medium text-muted-foreground",
                    section.href === pathname &&
                      "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-100",
                  )}
                >
                  <Image src={section.icon} alt="" width={16} height={16} />
                  {section.label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[92rem] px-4 py-5 md:px-6">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StudioNavLink({
  active,
  compact = false,
  description,
  href,
  icon,
  label,
}: {
  active: boolean;
  compact?: boolean;
  description?: string;
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-rose-100 text-rose-950 shadow-sm dark:bg-rose-950/35 dark:text-rose-100"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md border bg-background/70",
          active && "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40",
        )}
      >
        <Image src={icon} alt="" width={22} height={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{label}</span>
        {!compact && description ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {!compact ? (
        <ArrowRight className="size-3.5 opacity-0 transition group-hover:opacity-60" />
      ) : null}
    </Link>
  );
}
