import { supabase } from "../supabaseClient";

export async function getListMembers(listId) {
  const { data, error } = await supabase
    .from("list_members")
    .select("user_id, role, profiles(email, full_name)")
    .eq("list_id", listId);

  if (error) {
    throw error;
  }

  return data ?? [];
}
