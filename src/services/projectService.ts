import { getSupabaseClient } from "../lib/supabase";
import type { CloudProject, SavedProject } from "../types";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export async function fetchUserProjects(): Promise<ServiceResult<CloudProject[]>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Database not connected" };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("id, user_id, name, document, created_at, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as CloudProject[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to load projects" };
  }
}

export async function createCloudProject(
  name: string,
  document: SavedProject
): Promise<ServiceResult<CloudProject>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Database not connected" };
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { data: null, error: "You must be signed in to save projects to the cloud" };
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userData.user.id,
        name: name.trim() || "Untitled project",
        document,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as CloudProject, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to create project" };
  }
}

export async function updateCloudProject(
  id: string,
  name: string,
  document: SavedProject
): Promise<ServiceResult<CloudProject>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Database not connected" };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .update({
        name: name.trim() || "Untitled project",
        document,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as CloudProject, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to update project" };
  }
}

export async function deleteCloudProject(id: string): Promise<ServiceResult<boolean>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Database not connected" };
  }

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to delete project" };
  }
}
