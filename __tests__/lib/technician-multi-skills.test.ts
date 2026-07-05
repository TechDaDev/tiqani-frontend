import { describe, expect, it } from "vitest";
import { buildTechnicianSkillsPayload, validateTechnicianSkillsSelection } from "@/lib/api/profiles";
import { mapCategories } from "@/lib/marketplace/mappers";

describe("technician multi-skill taxonomy mapping", () => {
  it("preserves multiple skills under one category", () => {
    const categories = mapCategories([
      {
        id: "cat-a",
        name: "Category A",
        skills: [
          { id: "skill-1", name: "Skill 1", category: "cat-a", sub_skills: [] },
          { id: "skill-2", name: "Skill 2", category: "cat-a", sub_skills: [] },
        ],
      },
    ]);

    expect(categories[0].skills?.map((skill) => skill.id)).toEqual(["skill-1", "skill-2"]);
  });

  it("preserves sub-skills across categories", () => {
    const categories = mapCategories([
      {
        id: "cat-a",
        name: "Category A",
        skills: [
          { id: "skill-1", name: "Skill 1", category: "cat-a", sub_skills: [{ id: "sub-1", name: "Sub 1", skill: "skill-1" }] },
        ],
      },
      {
        id: "cat-b",
        name: "Category B",
        skills: [
          { id: "skill-2", name: "Skill 2", category: "cat-b", sub_skills: [{ id: "sub-2", name: "Sub 2", skill: "skill-2" }] },
        ],
      },
    ]);

    const subSkillIds = categories.flatMap((category) =>
      (category.skills ?? []).flatMap((skill) => (skill.subSkills ?? []).map((subSkill) => subSkill.id))
    );
    expect(subSkillIds).toEqual(["sub-1", "sub-2"]);
  });
});

describe("technician multi-skill payload", () => {
  it("sends arrays and deduplicates IDs", () => {
    expect(buildTechnicianSkillsPayload({
      categories: ["cat-a", "cat-a", "cat-b"],
      skills: ["skill-1", "skill-1", "skill-2"],
      sub_skills: ["sub-1", "sub-1"],
    })).toEqual({
      categories: ["cat-a", "cat-b"],
      skills: ["skill-1", "skill-2"],
      sub_skills: ["sub-1"],
    });
  });

  it("fails validation when no skill or sub-skill is selected", () => {
    expect(validateTechnicianSkillsSelection({ skills: [], sub_skills: [] })).toBe(false);
  });

  it("passes validation with multiple categories represented in payload", () => {
    const payload = buildTechnicianSkillsPayload({
      categories: ["cat-a", "cat-b"],
      skills: ["skill-1"],
      sub_skills: ["sub-2"],
    });

    expect(validateTechnicianSkillsSelection(payload)).toBe(true);
    expect(payload.categories).toEqual(["cat-a", "cat-b"]);
  });
});
