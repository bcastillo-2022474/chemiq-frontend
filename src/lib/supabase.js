import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jjwcanhaiolyzjwuuypr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqd2NhbmhhaW9seXpqd3V1eXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NjIxNzgsImV4cCI6MjA1OTEzODE3OH0.C88ffgcADWwukm5AT0DBdSFa7muucFVb8sp-TAokulY"; // Found in Supabase dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const storage = supabase.storage.from("chemiq");