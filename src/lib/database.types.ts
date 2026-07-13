// Hand-authored typed helpers matching supabase/schema.sql.
// If you change the schema, regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts

export type UserRole = "citizen" | "editor" | "admin";
export type PubStatus = "draft" | "published";
export type PostType = "news" | "announcement";
export type EventCategory =
  | "Sports"
  | "Arts"
  | "Leadership"
  | "Volunteering"
  | "Scholarships"
  | "SK Programs";
export type LegislationKind =
  | "ordinance"
  | "resolution"
  | "executive_order"
  | "administrative_order"
  | "proclamation";
export type DocumentCategory =
  | "Annual Budget"
  | "Bids & Projects"
  | "Financial Reports"
  | "Programs & Projects"
  | "Annual Investment Plans"
  | "Forms";
export type ProposalStatus = "open" | "closed";

type Timestamps = { created_at: string; updated_at: string };

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
} & Timestamps;

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  type: PostType;
  category: string | null;
  status: PubStatus;
  published_at: string | null;
  created_by: string | null;
} & Timestamps;

export type CityEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  cover_image: string | null;
  category: EventCategory;
  starts_at: string;
  ends_at: string | null;
  venue: string | null;
  organizer: string | null;
  capacity: number | null;
  registration_open: boolean;
  status: PubStatus;
  created_by: string | null;
} & Timestamps;

export type EventRegistration = {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
};

export type Legislation = {
  id: string;
  kind: LegislationKind;
  number: string;
  title: string;
  summary: string | null;
  pdf_url: string | null;
  date_approved: string | null;
  status: PubStatus;
  created_by: string | null;
} & Timestamps;

export type CityDocument = {
  id: string;
  title: string;
  description: string | null;
  category: DocumentCategory;
  office: string | null;
  file_url: string | null;
  year: number | null;
  status: PubStatus;
  created_by: string | null;
} & Timestamps;

export type Department = {
  id: string;
  name: string;
  head_name: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  sort_order: number;
} & Timestamps;

export type Service = {
  id: string;
  title: string;
  summary: string | null;
  steps: string[];
  department_id: string | null;
  form_url: string | null;
  fee: string | null;
  processing_time: string | null;
  sort_order: number;
} & Timestamps;

export type Official = {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  grouping: string;
  sort_order: number;
} & Timestamps;

export type Hotline = {
  id: string;
  name: string;
  numbers: string[];
  category: string;
  sort_order: number;
} & Timestamps;

export type Proposal = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  pdf_url: string | null;
  proposal_status: ProposalStatus;
  comments_close_at: string | null;
  status: PubStatus;
  created_by: string | null;
} & Timestamps;

export type ProposalComment = {
  id: string;
  proposal_id: string;
  user_id: string;
  body: string;
  approved: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  created_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  created_at: string;
};

type TableDef<Row, Required extends keyof Row, Generated extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required | Generated>>;
  Update: Partial<Omit<Row, "id">>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile, "id", "created_at" | "updated_at">;
      posts: TableDef<Post, "slug" | "title", "id" | "created_at" | "updated_at">;
      events: TableDef<CityEvent, "slug" | "title" | "starts_at", "id" | "created_at" | "updated_at">;
      event_registrations: TableDef<EventRegistration, "event_id" | "user_id", "id" | "created_at">;
      legislation: TableDef<Legislation, "kind" | "number" | "title", "id" | "created_at" | "updated_at">;
      documents: TableDef<CityDocument, "title" | "category", "id" | "created_at" | "updated_at">;
      departments: TableDef<Department, "name", "id" | "created_at" | "updated_at">;
      services: TableDef<Service, "title", "id" | "created_at" | "updated_at">;
      officials: TableDef<Official, "name" | "position", "id" | "created_at" | "updated_at">;
      hotlines: TableDef<Hotline, "name", "id" | "created_at" | "updated_at">;
      proposals: TableDef<Proposal, "slug" | "title", "id" | "created_at" | "updated_at">;
      proposal_comments: TableDef<ProposalComment, "proposal_id" | "user_id" | "body", "id" | "created_at">;
      contact_messages: TableDef<ContactMessage, "name" | "email" | "body", "id" | "created_at">;
      subscribers: TableDef<Subscriber, "email", "id" | "created_at">;
    };
    Views: Record<string, never>;
    Functions: {
      my_role: { Args: Record<string, never>; Returns: UserRole };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      pub_status: PubStatus;
      post_type: PostType;
      event_category: EventCategory;
      legislation_kind: LegislationKind;
      document_category: DocumentCategory;
      proposal_status: ProposalStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
