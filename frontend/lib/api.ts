const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface Material {
  uuid: string;
  name: string;
  item_number: string;
  price: string;
  cost: string;
  quantity_in_stock: number;
  price_includes_taxes: string;
  barcode: string;
  item_is_inventoried: string;
  active: number;
  edit_date: string;
  item_description: string;
  use_description_for_invoicing: string;
  tax_rate_uuid: string;
}

export interface MaterialsResponse {
  success: boolean;
  materials: Material[];
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<AuthResponse> => {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    return fetchAPI('/auth/me');
  },
};

export const materialsAPI = {
  list: async (): Promise<MaterialsResponse> => {
    return fetchAPI('/materials');
  },
};

export interface CheckoutItem {
  uuid: string;
  quantity: number;
  price: string;
}

export interface CheckoutResponse {
  success: boolean;
  job: any;
  message: string;
}

export interface Job {
  uuid: string;
  status: string;
  company_uuid: string;
  edit_date: string;
  created_date: string;
  [key: string]: any;
}

export interface JobsListResponse {
  success: boolean;
  jobs: Job[];
}

export interface JobMaterial {
  uuid: string;
  job_uuid: string;
  material_uuid: string;
  quantity: number;
  price: string;
  displayed_amount: string;
  [key: string]: any;
}

export interface JobDetailsResponse {
  success: boolean;
  job: Job;
  materials: JobMaterial[];
}

export interface Note {
  uuid: string;
  related_object: string;
  related_object_uuid: string;
  note: string;
  edit_date: string;
  created_date: string;
  [key: string]: any;
}

export interface NotesListResponse {
  success: boolean;
  notes: Note[];
}

export interface CreateNoteResponse {
  success: boolean;
  note: Note;
  message: string;
}

export const jobsAPI = {
  createJob: async (items: CheckoutItem[]): Promise<CheckoutResponse> => {
    return fetchAPI('/jobs', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  listJobs: async (): Promise<JobsListResponse> => {
    return fetchAPI('/jobs');
  },

  getJobDetails: async (uuid: string): Promise<JobDetailsResponse> => {
    return fetchAPI(`/jobs/${uuid}`);
  },

  createNote: async (uuid: string, note: string): Promise<CreateNoteResponse> => {
    return fetchAPI(`/jobs/${uuid}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  listNotes: async (uuid: string): Promise<NotesListResponse> => {
    return fetchAPI(`/jobs/${uuid}/notes`);
  },
};