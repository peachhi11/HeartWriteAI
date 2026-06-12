"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { LiquidThemePicker } from "@/components/liquid-theme-picker";
import { ModelStatusIndicator } from "@/components/model-status-indicator";
import { ModeToggle } from "@/components/mode-toggle";
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
    description: "Overview, imports, settings, and quick links.",
    href: "/",
    icon: "/brand/favicon.svg",
    label: "Dashboard",
  },
  {
    description: "Create, import, polish, convert, and export character cards.",
    href: "/workspace?mode=edit",
    icon: "/brand/icons/character-cards.svg",
    label: "Character Cards",
  },
  {
    description: "Create {{user}} personas or match them to characters.",
    href: "/personas",
    icon: "/brand/icons/persona-matching.svg",
    label: "Persona Matching",
  },
  {
    description: "Build world info, character notes, and scenario lorebooks.",
    href: "/lorebooks",
    icon: "/brand/icons/lorebooks.svg",
    label: "Lorebooks",
  },
  {
    description: "Prepare avatars, card art, and other visuals.",
    href: "/images",
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
    href: "/libraries",
    icon: "/brand/icons/card-conversion.svg",
    label: "Libraries",
  },
  {
    href: "/scenarios",
    icon: "/brand/icons/lorebooks.svg",
    label: "Scenarios",
  },
  {
    href: "/relationship-tracker",
    icon: "/brand/icons/character-chat.svg",
    label: "Tracker",
  },
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

const navigationSections = [...primarySections, ...utilitySections];

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
    <main className="min-h-screen overflow-hidden text-foreground">
      <div className="amour-studio-ambient pointer-events-none fixed inset-0 -z-10" />
      <div className="flex min-h-screen min-w-0">
        <aside className="liquid-glass sticky top-0 z-40 hidden h-screen w-20 shrink-0 rounded-none border-y-0 border-l-0 px-3 py-4 md:flex md:flex-col md:items-center">
          <Link
            href="/"
            className="mb-5 rounded-2xl transition hover:scale-[1.03]"
            aria-label="HeartWriteAI dashboard"
            title="HeartWriteAI"
          >
            <Image
              src="/brand/brand-mark.svg"
              alt=""
              width={48}
              height={48}
              className="liquid-icon rounded-2xl p-1.5"
              priority
            />
          </Link>

          <nav className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto py-1">
            {navigationSections.map((section, index) => (
              <NavIconLink
                key={`${section.href}-${section.label}`}
                active={isSectionActive(section.href, pathname, activeSection)}
                href={section.href}
                icon={section.icon}
                label={section.label}
                onNavigate={() => setActiveSection(getSectionFromHref(section.href))}
                separated={index === primarySections.length}
              />
            ))}
          </nav>

          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <LiquidThemePicker />
              <ModeToggle />
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="liquid-glass sticky top-0 z-30 rounded-none border-x-0 border-t-0 px-4 py-3 md:mx-4 md:mt-4 md:rounded-[2rem] md:border md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/brand/brand-mark.svg"
                  alt=""
                  width={44}
                  height={44}
                  className="liquid-icon shrink-0 rounded-2xl p-1.5 md:hidden"
                  priority
                />
                <div className="min-w-0">
                  <p className="mb-1 hidden truncate text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
                    {eyebrow}
                  </p>
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
                <ModelStatusIndicator />
                <div className="md:hidden">
                  <div className="flex items-center gap-2">
                    <LiquidThemePicker />
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </div>

            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
              {navigationSections.map((section) => (
                <MobileNavIconLink
                  key={`${section.href}-${section.label}`}
                  active={isSectionActive(section.href, pathname, activeSection)}
                  href={section.href}
                  icon={section.icon}
                  label={section.label}
                  onNavigate={() => setActiveSection(getSectionFromHref(section.href))}
                />
              ))}
            </nav>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[92rem] px-4 py-5 md:px-6 md:pt-6">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function NavIconLink({
  active,
  href,
  icon,
  label,
  onNavigate,
  separated,
}: {
  active: boolean;
  href: string;
  icon: string;
  label: string;
  onNavigate: () => void;
  separated?: boolean;
}) {
  return (
    <div className={cn("relative group", separated && "mt-4 pt-4 before:absolute before:left-2 before:right-2 before:top-0 before:h-px before:bg-border/70")}>
      <Link
        href={href}
        onClick={onNavigate}
        aria-label={label}
        title={label}
        className={cn(
          "liquid-icon liquid-nav-icon flex size-12 items-center justify-center rounded-2xl transition duration-200 hover:-translate-y-0.5 hover:shadow-lg",
          active ? "scale-[1.03] ring-1 ring-[color:var(--liquid-accent)]" : "",
        )}
        data-active={active}
      >
        <span
          aria-hidden="true"
          className="liquid-nav-mask size-[22px] shrink-0 opacity-85 transition group-hover:opacity-100"
          style={{
            WebkitMaskImage: `url(${icon})`,
            maskImage: `url(${icon})`,
          }}
        />
      </Link>
      <span className="liquid-glass pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

function MobileNavIconLink({
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
      aria-label={label}
      title={label}
      className={cn(
        "liquid-icon liquid-nav-icon inline-flex size-11 shrink-0 items-center justify-center rounded-2xl transition",
        active ? "scale-[1.03] ring-1 ring-[color:var(--liquid-accent)]" : "",
      )}
      data-active={active}
    >
      <span
        aria-hidden="true"
        className="liquid-nav-mask size-5 opacity-85"
        style={{
          WebkitMaskImage: `url(${icon})`,
          maskImage: `url(${icon})`,
        }}
      />
      <span className="sr-only">{label}</span>
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
