/**
 * Domain module tests for Phase 8 — schemas, status, actions.
 */
import { describe, it, expect } from "vitest";
import { z } from "zod";

// ── Execution schemas ──
import {
  ContractExecutionEligibilitySchema,
  ExecutionHistoryEventSchema,
} from "@/lib/execution/schemas";

// ── Milestone schemas ──
import { MilestoneSchema, MilestoneListSchema } from "@/lib/milestones/schemas";

// ── Deliverable schemas ──
import {
  DeliverableSubmissionSchema,
  RevisionRequestSchema,
} from "@/lib/deliverables/schemas";

// ── Status helpers ──
import { getExecutionStatusLabel } from "@/lib/execution/status";
import { getMilestoneStatusLabel } from "@/lib/milestones/status";

// ── Actions ──
import {
  getClientActions,
  getTechnicianActions,
} from "@/lib/execution/actions";
import { CONTRACT_EXECUTION_STATUS } from "@/lib/execution/types";
import { getClientMilestoneActions, getTechnicianMilestoneActions } from "@/lib/milestones/actions";
import { MILESTONE_STATUS } from "@/lib/milestones/types";

describe("ContractExecutionEligibilitySchema", () => {
  it("parses valid eligibility response", () => {
    const data = {
      eligible: true,
      reason: "",
      contract_status: "active",
      funding_status: "funded",
      milestone_count: 3,
      can_activate: true,
      can_request_completion: false,
      can_confirm_completion: false,
    };
    expect(() => ContractExecutionEligibilitySchema.parse(data)).not.toThrow();
  });

  it("rejects missing fields", () => {
    expect(() =>
      ContractExecutionEligibilitySchema.parse({ eligible: true }),
    ).toThrow(z.ZodError);
  });
});

describe("ExecutionHistoryEventSchema", () => {
  it("parses valid event", () => {
    const event = {
      id: "00000000-0000-0000-0000-000000000001",
      contract: "00000000-0000-0000-0000-000000000002",
      event_type: "CONTRACT_ACTIVATED",
      actor: "00000000-0000-0000-0000-000000000003",
      actor_name: "Test User",
      payload: null,
      created_at: "2026-06-20T00:00:00Z",
    };
    expect(() => ExecutionHistoryEventSchema.parse(event)).not.toThrow();
  });
});

describe("MilestoneSchema", () => {
  it("parses valid milestone", () => {
    const ms = {
      id: "00000000-0000-0000-0000-000000000010",
      contract: "00000000-0000-0000-0000-000000000020",
      sequence: 1,
      title: "Test Milestone",
      description: "Test description",
      due_date: null,
      status: "DRAFT",
      created_at: "2026-06-20T00:00:00Z",
      updated_at: "2026-06-20T00:00:00Z",
      started_at: null,
      submitted_at: null,
      approved_at: null,
      revision_count: 0,
    };
    expect(() => MilestoneSchema.parse(ms)).not.toThrow();
  });

  it("accepts unknown status", () => {
    const ms = {
      id: "00000000-0000-0000-0000-000000000010",
      contract: "00000000-0000-0000-0000-000000000020",
      sequence: 1,
      title: "Test",
      description: "",
      due_date: null,
      status: "UNKNOWN_STATUS",
      created_at: "2026-06-20T00:00:00Z",
      updated_at: "2026-06-20T00:00:00Z",
      started_at: null,
      submitted_at: null,
      approved_at: null,
      revision_count: 0,
    };
    expect(() => MilestoneSchema.parse(ms)).not.toThrow();
  });
});

describe("MilestoneListSchema", () => {
  it("parses paginated milestone list", () => {
    const data = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "00000000-0000-0000-0000-000000000010",
          contract: "00000000-0000-0000-0000-000000000020",
          sequence: 1,
          title: "M1",
          description: "",
          due_date: null,
          status: "DRAFT",
          created_at: "2026-06-20T00:00:00Z",
          updated_at: "2026-06-20T00:00:00Z",
          started_at: null,
          submitted_at: null,
          approved_at: null,
          revision_count: 0,
        },
      ],
    };
    const parsed = MilestoneListSchema.parse(data);
    expect(parsed.count).toBe(1);
    expect(parsed.results).toHaveLength(1);
  });
});

describe("DeliverableSubmissionSchema", () => {
  it("parses valid submission", () => {
    const sub = {
      id: "00000000-0000-0000-0000-000000000030",
      milestone: "00000000-0000-0000-0000-000000000040",
      submitted_by: "00000000-0000-0000-0000-000000000050",
      submitted_by_name: "Tech User",
      version: 1,
      summary: "Work completed",
      notes: "",
      external_link: "",
      submitted_at: "2026-06-20T00:00:00Z",
      created_at: "2026-06-20T00:00:00Z",
    };
    expect(() => DeliverableSubmissionSchema.parse(sub)).not.toThrow();
  });
});

describe("RevisionRequestSchema", () => {
  it("parses valid revision", () => {
    const rev = {
      id: "00000000-0000-0000-0000-000000000060",
      milestone: "00000000-0000-0000-0000-000000000040",
      submission: "00000000-0000-0000-0000-000000000030",
      requested_by: "00000000-0000-0000-0000-000000000070",
      requested_by_name: "Client User",
      reason: "Needs improvement",
      status: "PENDING",
      revision_number: 1,
      created_at: "2026-06-20T00:00:00Z",
      resolved_at: null,
    };
    expect(() => RevisionRequestSchema.parse(rev)).not.toThrow();
  });
});

describe("Execution status labels", () => {
  it("returns label for known statuses", () => {
    expect(getExecutionStatusLabel("active")).toBeTruthy();
    expect(getExecutionStatusLabel("completed")).toBeTruthy();
    expect(getExecutionStatusLabel("completion_requested")).toBeTruthy();
  });

  it("returns raw status for unknown statuses", () => {
    expect(getExecutionStatusLabel("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("Milestone status labels", () => {
  it("returns label for known milestone statuses", () => {
    expect(getMilestoneStatusLabel("DRAFT")).toBeTruthy();
    expect(getMilestoneStatusLabel("APPROVED")).toBeTruthy();
  });

  it("returns raw status for unknown statuses", () => {
    expect(getMilestoneStatusLabel("UNKNOWN_MS")).toBe("UNKNOWN_MS");
  });
});

describe("Client actions", () => {
  it("client can activate when in_progress with milestones", () => {
    const actions = getClientActions(
      CONTRACT_EXECUTION_STATUS.IN_PROGRESS,
      2,
    );
    expect(actions.canActivate).toBe(true);
    expect(actions.canStartMilestone).toBe(false);
    expect(actions.canSubmitDeliverable).toBe(false);
    expect(actions.canRequestCompletion).toBe(false);
  });

  it("client cannot activate without milestones", () => {
    const actions = getClientActions(
      CONTRACT_EXECUTION_STATUS.IN_PROGRESS,
      0,
    );
    expect(actions.canActivate).toBe(false);
  });

  it("client can confirm/reject when completion_requested", () => {
    const actions = getClientActions(
      CONTRACT_EXECUTION_STATUS.COMPLETION_REQUESTED,
      0,
    );
    expect(actions.canConfirmCompletion).toBe(true);
    expect(actions.canRejectCompletion).toBe(true);
  });
});

describe("Technician actions", () => {
  it("tech can start milestone when active", () => {
    const actions = getTechnicianActions(
      CONTRACT_EXECUTION_STATUS.ACTIVE,
    );
    expect(actions.canStartMilestone).toBe(true);
    expect(actions.canSubmitDeliverable).toBe(true);
    expect(actions.canCreateMilestone).toBe(false);
    expect(actions.canApproveMilestone).toBe(false);
  });
});

describe("Milestone client actions", () => {
  it("client can edit draft milestones", () => {
    const actions = getClientMilestoneActions(MILESTONE_STATUS.DRAFT);
    expect(actions.canEdit).toBe(true);
  });

  it("client cannot edit approved milestones", () => {
    const actions = getClientMilestoneActions(MILESTONE_STATUS.APPROVED);
    expect(actions.canEdit).toBe(false);
  });
});

describe("Milestone technician actions", () => {
  it("tech can start pending milestone", () => {
    const actions = getTechnicianMilestoneActions(MILESTONE_STATUS.PENDING);
    expect(actions.canStart).toBe(true);
  });

  it("tech can submit during IN_PROGRESS or REVISION_REQUESTED", () => {
    expect(getTechnicianMilestoneActions(MILESTONE_STATUS.IN_PROGRESS).canSubmit).toBe(true);
    expect(getTechnicianMilestoneActions(MILESTONE_STATUS.REVISION_REQUESTED).canSubmit).toBe(true);
  });

  it("tech cannot approve", () => {
    const actions = getTechnicianMilestoneActions(MILESTONE_STATUS.SUBMITTED);
    expect(actions.canApprove).toBe(false);
  });
});
