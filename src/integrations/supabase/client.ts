// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ynfkbnxvnsueeuxpuscm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZmtibnh2bnN1ZWV1eHB1c2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMTg3MjYsImV4cCI6MjA1OTY5NDcyNn0.Fe5t89c3Q9wLXSKuyclREPez1gR5zHfV4HBF5yWFXAM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);