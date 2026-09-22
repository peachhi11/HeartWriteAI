"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";

export function createClient() {
  const { supabasePublishableKey, supabaseUrl } = getSupabaseBrowserEnv();

  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
