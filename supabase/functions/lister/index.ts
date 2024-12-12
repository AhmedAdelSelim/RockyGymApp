import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  // Secure the function with an API key
  const apiKey = req.headers.get("x-api-key");
  const secretKey = Deno.env.get("API_KEY");

  if (!apiKey || apiKey !== secretKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
    });
  }

  // Initialize Supabase client
  const supabase = createClient(
    "https://bxjyigjzkbhxeithvnzu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4anlpZ2p6a2JoeGVpdGh2bnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTYwNTA3OSwiZXhwIjoyMDM3MTgxMDc5fQ.l2OCtfO8Z_7QUTE3ftc7HcZNlrMkQP2ftuYHS9SPX-c"
  );

  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    return new Response(JSON.stringify({ users: data.users }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
