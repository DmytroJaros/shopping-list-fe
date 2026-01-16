import { supabase } from "../supabaseClient";

export async function sendInvite({ listId, email, baseUrl }) {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;

  const { data, error } = await supabase.functions.invoke("send-invite", {
    body: {
      listId,
      email,
      baseUrl,
    },
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function acceptInvite(token) {
  const { data, error } = await supabase.rpc("accept_invite", {
    invite_token: token,
  });

  if (error) {
    throw error;
  }

  return data;
}
