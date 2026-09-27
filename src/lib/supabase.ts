/**
 * SakhiSphere Supabase Integration Stub (Zero External Dependencies)
 * 
 * In this Frontend-Only MVP mode:
 * - Supabase external packages and network connections are fully removed.
 * - No environment variables or external API keys are required.
 * - All application views, search, filtering, reels, reviews, and dashboards run locally via mockData and React state.
 * - This stub provides the standard Supabase client shape so future production migrations can plug in seamlessly.
 */

export const isSupabaseConfigured: boolean = false;

export interface MockSupabaseQueryBuilder<T = any> {
  select: (columns?: string) => Promise<{ data: T[]; error: null }>;
  insert: (values: any) => Promise<{ data: any; error: null }>;
  update: (values: any) => Promise<{ data: any; error: null }>;
  delete: () => Promise<{ data: any; error: null }>;
  eq: (column: string, value: any) => MockSupabaseQueryBuilder<T>;
  order: (column: string, options?: any) => MockSupabaseQueryBuilder<T>;
  limit: (count: number) => MockSupabaseQueryBuilder<T>;
}

export interface MockSupabaseClient {
  from: (table: string) => MockSupabaseQueryBuilder;
  auth: {
    getSession: () => Promise<{ data: { session: null }; error: null }>;
    getUser: () => Promise<{ data: { user: null }; error: null }>;
    signInWithPassword: (creds: any) => Promise<{ data: { user: null; session: null }; error: null }>;
    signUp: (creds: any) => Promise<{ data: { user: null; session: null }; error: null }>;
    signOut: () => Promise<{ error: null }>;
    onAuthStateChange: (callback: any) => { data: { subscription: { unsubscribe: () => void } } };
  };
  storage: {
    from: (bucket: string) => {
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
      upload: (path: string, file: any) => Promise<{ data: { path: string }; error: null }>;
    };
  };
}

function createMockQueryBuilder(): MockSupabaseQueryBuilder {
  const builder: any = {
    select: async () => ({ data: [], error: null }),
    insert: async (val: any) => ({ data: val, error: null }),
    update: async (val: any) => ({ data: val, error: null }),
    delete: async () => ({ data: null, error: null }),
    eq: () => builder,
    order: () => builder,
    limit: () => builder,
  };
  return builder;
}

export const supabase: MockSupabaseClient = {
  from: () => createMockQueryBuilder(),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: () => ({
      getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
      upload: async (path: string) => ({ data: { path }, error: null }),
    }),
  },
};
