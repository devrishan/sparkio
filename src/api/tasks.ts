import apiClient from "./axios";

export interface Task {
  id: string;
  title: string;
  description: string;
  slug: string;
  type: string;
  reward_amount: number;
  reward_coins: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TaskSubmission {
  id: string;
  task: {
    id: string;
    title: string;
    slug: string;
    reward_amount: number;
    reward_coins: number;
  };
  status: "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "DELETED";
  proof_url: string | null;
  proof_type: string | null;
  notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface SubmitTaskPayload {
  task_id: string;
  proof_url?: string;
  proof_type?: string;
  notes?: string;
}

export interface SubmitTaskResponse {
  success: boolean;
  submission?: TaskSubmission;
  message?: string;
  error?: string;
}

/**
 * Get all available tasks
 */
export async function getTasks(filters?: {
  category_id?: string;
  difficulty?: string;
  is_active?: boolean;
}): Promise<Task[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category_id) params.append("category_id", filters.category_id);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.is_active !== undefined) params.append("is_active", filters.is_active.toString());

    const response = await apiClient.get<{ tasks: Task[]; success: boolean }>(
      `/api/tasks?${params.toString()}`
    );
    return response.data.tasks || [];
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

/**
 * Get a single task by ID
 */
export async function getTask(id: string): Promise<Task | null> {
  try {
    const response = await apiClient.get<{ task: Task; success: boolean }>(`/api/tasks/${id}`);
    return response.data.task || null;
  } catch (error: any) {
    console.error("Error fetching task:", error);
    return null;
  }
}

/**
 * Submit a task
 */
export async function submitTask(
  taskId: string,
  payload: { proof_file: File; notes?: string }
): Promise<SubmitTaskResponse> {
  try {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("proof", payload.proof_file);
    if (payload.notes) formData.append("notes", payload.notes);

    const response = await apiClient.post<SubmitTaskResponse>(
      "/api/member/tasks/submit",
      formData
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to submit task",
    };
  }
}

/**
 * Get user's task submissions
 */
export async function getTaskSubmissions(filters?: {
  status?: string;
  page?: number;
  perPage?: number;
}): Promise<{ data: TaskSubmission[]; pagination: any }> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.perPage) params.append("perPage", filters.perPage.toString());

    const response = await apiClient.get<{
      success: boolean;
      data: TaskSubmission[];
      pagination: any;
    }>(`/api/member/tasks/submissions?${params.toString()}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error: any) {
    console.error("Error fetching task submissions:", error);
    return { data: [], pagination: {} };
  }
}

