/** Deliverable & Revision domain types */

/** Deliverable submission (from DeliverableSubmissionSerializer) */
export interface DeliverableSubmission {
  id: string;
  milestone: string;
  submitted_by: string;
  submitted_by_name: string;
  version: number;
  summary: string;
  notes: string;
  external_link: string;
  submitted_at: string;
  created_at: string;
}

export interface DeliverableCreatePayload {
  summary: string;
  notes?: string;
  external_link?: string;
}

/** Revision request (from RevisionRequestSerializer) */
export interface RevisionRequest {
  id: string;
  milestone: string;
  submission: string;
  requested_by: string;
  requested_by_name: string;
  reason: string;
  status: string;
  revision_number: number;
  created_at: string;
  resolved_at: string | null;
}

export interface RevisionCreatePayload {
  reason: string;
}
