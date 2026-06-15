# Technician Onboarding

## Backend Model

There is **no dedicated onboarding endpoint** on the Django backend. Onboarding is a **client-side construct** derived from the technician profile completion state.

The backend exposes a single completion-tracking endpoint:
- `GET /api/auth/profile/incomplete-fields/` — returns the profile completion status for the authenticated user

## Onboarding = Profile Completion Workflow

The onboarding flow is built on three backend concepts:

1. **Profile completeness** — The technician profile model tracks which required fields are filled
2. **Incomplete fields** — The backend returns a list of field names that are still empty
3. **Approval status** — The technician's `approved` field indicates whether an admin has approved the account

### Completion Contract

**Endpoint:** `GET /api/profile/incomplete-fields` (proxied to `/api/auth/profile/incomplete-fields/`)

**Response:**
```json
{
  "is_complete": false,
  "incomplete_fields": ["phone_number", "governorate", "job_title"],
  "total_required": 10,
  "completed_count": 7,
  "completion_percentage": 70
}
```

| Field | Type | Description |
|-------|------|-------------|
| `is_complete` | boolean | All required fields are filled |
| `incomplete_fields` | string[] | Names of fields still missing |
| `total_required` | number | Total number of required fields |
| `completed_count` | number | Number of completed fields |
| `completion_percentage` | number | 0–100 integer percentage |

## Onboarding Steps

The frontend defines 10 onboarding steps in `ONBOARDING_STEPS` array. Each step corresponds to a backend field:

| # | Step Key | Field | Icon | Category |
|---|----------|-------|------|----------|
| 1 | `phone` | `phone_number` | UserCheck | Contact |
| 2 | `location` | `governorate` | UserCheck | Location |
| 3 | `address` | `address` | UserCheck | Location |
| 4 | `gender` | `gender` | UserCheck | Personal |
| 5 | `dob` | `date_of_birth` | UserCheck | Personal |
| 6 | `profileImage` | `profile_image` | Image | Media |
| 7 | `jobTitle` | `job_title` | Briefcase | Professional |
| 8 | `about` | `about` | Briefcase | Professional |
| 9 | `experience` | `years_of_expertise` | Star | Professional |
| 10 | `idDocs` | `identification_documents` | Upload | Verification |

A step is marked **completed** if its field name is **not** in `incomplete_fields[]`.

## State Reconstruction on Reload

Since onboarding is derived state (not persisted), **every page load reconstructs the full state from the backend**:

1. Call `fetchTechnicianProfile()` → current profile data
2. Call `fetchIncompleteFields()` → completion status
3. Compare `incomplete_fields` against `ONBOARDING_STEPS`
4. Calculate progress: `(completedSteps / totalSteps) * 100`

There is no local onboarding progress tracking. All saved progress comes from profile PATCH requests.

## Approval vs. Completion

Approval is **separate from profile completeness**:

| State | `is_complete` | `approved` | Frontend Display |
|-------|---------------|------------|------------------|
| Profile incomplete | `false` | `null` | Checklist with pending steps, neutral approval banner |
| Complete, pending review | `true` | `false` | Checklist complete, amber "Pending Approval" banner |
| Complete, approved | `true` | `true` | Checklist complete, green "Approved" banner |
| Not yet submitted | `false` | `null` | Checklist with pending steps, gray "Not Submitted" banner |

## Profile Update Flow

To complete onboarding steps, the user edits their profile:

1. Navigate to `/profile/technician`
2. Edit fields (job title, about, experience, URLs)
3. Submit PATCH via `updateTechnicianProfile()`
4. Reload incomplete fields via `fetchIncompleteFields()`
5. Onboarding page reflects updated state on next load

## Onboarding Page Architecture

The onboarding page (`app/[locale]/(protected)/onboarding/page.tsx`) is a **client component** that:

- Fetches both `TechnicianProfileData` and `IncompleteFieldsData` on mount
- Renders a progress bar (`completedSteps / totalSteps`)
- Shows an approval status card (approved / pending / not submitted)
- Lists all 10 steps with completion checkmarks
- Links incomplete steps to `/profile/technician` for editing
- Shows a profile summary card with key fields

## Current Limitations

- **No dedicated onboarding endpoint** — the page derives state from two separate API calls
- **No reference-data endpoints** — categories and skills are selected by UUID only (no dropdown data endpoint)
- **Image upload** is profile PATCH/multipart based, not yet wired in the onboarding UI
- **No client onboarding** — the completion flow is technician-only
