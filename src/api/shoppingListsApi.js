import { supabase } from "../supabaseClient";

async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (!data.user) {
    throw new Error("Not authenticated");
  }
  return data.user;
}

function normalizeItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map((item) => ({
    id: item.id,
    name: item.name,
    done: Boolean(item.done),
  }));
}

function mapListRow(row, userId) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    isArchived: row.is_archived ?? false,
    isOwner: row.created_by === userId,
    items: normalizeItems(row.items),
  };
}

// GET /shopping-lists
export async function getShoppingLists() {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("shopping_lists")
    .select("id,name,description,is_archived,items,created_by,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapListRow(row, user.id));
}

// GET /shopping-lists/:id
export async function getShoppingListById(id) {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("shopping_lists")
    .select("id,name,description,is_archived,items,created_by,created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return mapListRow(data, user.id);
}

// POST /shopping-lists
export async function createShoppingList(data) {
  const user = await requireUser();

  const payload = {
    name: data?.name ?? "New list",
    description: data?.description ?? "",
    is_archived: data?.isArchived ?? false,
    created_by: user.id,
    items: data?.items ?? [],
  };

  const { data: created, error } = await supabase
    .from("shopping_lists")
    .insert(payload)
    .select("id,name,description,is_archived,items,created_by,created_at")
    .single();

  if (error) {
    throw error;
  }

  const { error: memberError } = await supabase.from("list_members").insert({
    list_id: created.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    throw memberError;
  }

  return mapListRow(created, user.id);
}

// PUT /shopping-lists/:id
export async function updateShoppingList(id, data) {
  const user = await requireUser();

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(data, "name")) {
    updates.name = data.name;
  }
  if (Object.prototype.hasOwnProperty.call(data, "description")) {
    updates.description = data.description ?? "";
  }
  if (Object.prototype.hasOwnProperty.call(data, "isArchived")) {
    updates.is_archived = data.isArchived;
  }
  if (Object.prototype.hasOwnProperty.call(data, "items")) {
    updates.items = data.items ?? [];
  }

  if (Object.keys(updates).length === 0) {
    return null;
  }

  const { data: updated, error } = await supabase
    .from("shopping_lists")
    .update(updates)
    .eq("id", id)
    .select("id,name,description,is_archived,items,created_by,created_at")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return mapListRow(updated, user.id);
}

// DELETE /shopping-lists/:id
export async function deleteShoppingList(id) {
  await requireUser();

  const { error } = await supabase.from("shopping_lists").delete().eq("id", id);
  if (error) {
    return false;
  }

  return true;
}
