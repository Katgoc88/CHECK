
<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

  const supabase = createClient(
    "https://jrebwhkfpovckibmovfm.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZWJ3aGtmcG92Y2tpYm1vdmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTA3MDAsImV4cCI6MjA2NTY4NjcwMH0.KEqwzNTpni8hO7BR-Er3rWpXlG0CswjcBbq7wYRUhrU"
  );

  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;
  if (!user) {
    window.location.href = "login.html";
  }

  const saved = localStorage.getItem("haslo-ok");
  if (saved !== "true") {
    const input = prompt("Enter password to access this page:");
    if (input === "rutynadw") {
      localStorage.setItem("haslo-ok", "true");
    } else {
      document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>Access Denied</h2>";
    }
  }

  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  for (const cb of checkboxes) {
    const { data, error } = await supabase
      .from("checkboxes")
      .select("checked")
      .eq("user_id", user.id)
      .eq("id", cb.id)
      .single();

    if (data) cb.checked = data.checked;

    cb.addEventListener("change", async () => {
      await supabase
        .from("checkboxes")
        .upsert({ user_id: user.id, id: cb.id, checked: cb.checked });
    });
  }

  document.getElementById("reset-all").addEventListener("click", async () => {
    for (const cb of checkboxes) {
      cb.checked = false;
      await supabase
        .from("checkboxes")
        .upsert({ user_id: user.id, id: cb.id, checked: false });
    }
  });
</script>
