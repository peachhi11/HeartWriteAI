"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    function syncActiveSection() {
      setActiveSection(new URLSearchParams(window.location.search).get("section"));
    }

    syncActiveSection();
    window.addEventListener("popstate", syncActiveSection);

    return () => window.removeEventListener("popstate", syncActiveSection);
  }, [pathname]);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="amour-studio-ambient pointer-events-none fixed inset-0 -z-10" />
      <div className="flex min-h-screen min-w-0 flex-col">
        <section className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b bg-background/90 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/brand/brand-mark.svg"
                  alt=""
                  width={44}
                  height={44}
                  className="shrink-0 rounded-2xl bg-rose-50 p-1.5 shadow-inner dark:bg-rose-950/30"
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

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:grid xl:grid-cols-7 xl:overflow-visible">
              {primarySections.map((section) => (
                <TopNavLink
                  key={section.label}
                  active={isSectionActive(section.href, pathname, activeSection)}
                  href={section.href}
                  icon={section.icon}
                  label={section.label}
                  onNavigate={() => setActiveSection(getSectionFromHref(section.href))}
                />
              ))}
            </nav>

            <nav className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {utilitySections.map((section) => (
                <Link
                  key={section.label}
                  href={section.href}
                  onClick={() => setActiveSection(getSectionFromHref(section.href))}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    isSectionActive(section.href, pathname, activeSection) &&
                      "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-100",
                  )}
                >
                  <Image
                    src={section.icon}
                    alt=""
                    width={14}
                    height={14}
                    className="opacity-75 dark:brightness-0 dark:invert"
                  />
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

function TopNavLink({
  active,
  href,
  icon,
  label,
  onNavigate,
}: {
  active: boolean;
  href: string;
  icon: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex h-12 shrink-0 items-center justify-center gap-2 rounded-md border bg-card/80 px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground xl:shrink",
        active
          ? "border-rose-200 bg-rose-50 text-rose-950 shadow-sm dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-100"
          : "border-border",
      )}
    >
      <Image
        src={icon}
        alt=""
        width={18}
        height={18}
        className="shrink-0 opacity-75 transition group-hover:opacity-100 dark:brightness-0 dark:invert"
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function isSectionActive(
  href: string,
  pathname: string,
  activeSection: string | null,
) {
  const [hrefPath, query] = href.split("?");
  const section = new URLSearchParams(query ?? "").get("section");

  if (section) {
    return pathname === hrefPath && activeSection === section;
  }

  return pathname === hrefPath && !activeSection;
}

function getSectionFromHref(href: string) {
  const [, query] = href.split("?");
  return new URLSearchParams(query ?? "").get("section");
}
