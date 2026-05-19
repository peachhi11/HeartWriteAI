import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StudioSectionPageProps {
  eyebrow: string;
  icon: LucideIcon;
  panels: ReadonlyArray<{
    body: string;
    title: string;
  }>;
  primaryAction: string;
  primaryHref: string;
  status: string;
  subtitle: string;
  title: string;
}

export function StudioSectionPage({
  eyebrow,
  icon: Icon,
  panels,
  primaryAction,
  primaryHref,
  status,
  subtitle,
  title,
}: StudioSectionPageProps) {
  return (
    <StudioShell
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      actions={<Badge variant="outline">{status}</Badge>}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-xl border bg-card/80 p-5 shadow-xl backdrop-blur">
          <div className="flex max-w-3xl flex-col gap-5">
            <div className="flex size-12 items-center justify-center rounded-lg border bg-background/80">
              <Icon className="size-6 text-rose-700 dark:text-rose-200" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Build Surface
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This workspace is now routed and ready for implementation. The
                first pass keeps the user flow visible, names the required data,
                and gives the next build step a stable URL instead of a dashboard
                placeholder.
              </p>
            </div>
            <Button asChild className="w-fit">
              <Link href={primaryHref}>{primaryAction}</Link>
            </Button>
          </div>
        </section>

        <aside className="rounded-xl border bg-card/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Workspace State
          </p>
          <p className="mt-3 text-sm leading-6">
            The route is live. The next step is replacing this scaffold with the
            editor controls, generation actions, and local persistence required
            by this section.
          </p>
        </aside>

        <section className="grid gap-4 xl:col-span-2 md:grid-cols-3">
          {panels.map((panel) => (
            <Card key={panel.title} className="bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">{panel.title}</CardTitle>
                <CardDescription className="leading-6">
                  {panel.body}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
    </StudioShell>
  );
}
