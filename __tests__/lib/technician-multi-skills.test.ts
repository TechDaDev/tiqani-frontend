import { describe, expect, it } from "vitest";
import {
  buildTechnicianSkillsPayload,
  validateTechnicianSkillsSelection,
} from "@/lib/api/profiles";
import { normalizeCategoryResponse } from "@/lib/marketplace/api";
import { mapCategories } from "@/lib/marketplace/mappers";
import {
  buildSkillSelectionChips,
  countSelectedInCategory,
  filterSkillCategories,
} from "@/lib/technician/skills-selector";

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

    expect(categories[0].skills?.map((skill) => skill.id)).toEqual([
      "skill-1",
      "skill-2",
    ]);
  });

  it("preserves sub-skills across categories", () => {
    const categories = mapCategories([
      {
        id: "cat-a",
        name: "Category A",
        skills: [
          {
            id: "skill-1",
            name: "Skill 1",
            category: "cat-a",
            sub_skills: [{ id: "sub-1", name: "Sub 1", skill: "skill-1" }],
          },
        ],
      },
      {
        id: "cat-b",
        name: "Category B",
        skills: [
          {
            id: "skill-2",
            name: "Skill 2",
            category: "cat-b",
            sub_skills: [{ id: "sub-2", name: "Sub 2", skill: "skill-2" }],
          },
        ],
      },
    ]);

    const subSkillIds = categories.flatMap((category) =>
      (category.skills ?? []).flatMap((skill) =>
        (skill.subSkills ?? []).map((subSkill) => subSkill.id),
      ),
    );
    expect(subSkillIds).toEqual(["sub-1", "sub-2"]);
  });

  it("normalizes a paginated category response", () => {
    const response = normalizeCategoryResponse({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "cat-a",
          name: "Category A",
          skills: [
            {
              id: "skill-1",
              name: "Skill 1",
              category: "cat-a",
              sub_skills: [],
            },
          ],
        },
      ],
    });

    expect(response.count).toBe(1);
    expect(response.results[0].skills?.[0].id).toBe("skill-1");
  });

  it("normalizes an array category response", () => {
    const response = normalizeCategoryResponse([
      {
        id: "cat-a",
        name: "Category A",
        skills: [
          { id: "skill-1", name: "Skill 1", category: "cat-a", sub_skills: [] },
        ],
      },
    ]);

    expect(response.count).toBe(1);
    expect(response.next).toBeNull();
    expect(response.results[0].name).toBe("Category A");
  });
});

describe("technician multi-skill payload", () => {
  it("sends arrays and deduplicates IDs", () => {
    expect(
      buildTechnicianSkillsPayload({
        categories: ["cat-a", "cat-a", "cat-b"],
        skills: ["skill-1", "skill-1", "skill-2"],
        sub_skills: ["sub-1", "sub-1"],
      }),
    ).toEqual({
      categories: ["cat-a", "cat-b"],
      skills: ["skill-1", "skill-2"],
      sub_skills: ["sub-1"],
    });
  });

  it("fails validation when no skill or sub-skill is selected", () => {
    expect(
      validateTechnicianSkillsSelection({ skills: [], sub_skills: [] }),
    ).toBe(false);
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

describe("technician skills selector helpers", () => {
  const categories = mapCategories([
    {
      id: "cat-design",
      name: "Design",
      skills: [
        {
          id: "skill-ui",
          name: "UI Design",
          category: "cat-design",
          sub_skills: [
            { id: "sub-wireframes", name: "Wireframes", skill: "skill-ui" },
          ],
        },
      ],
    },
    {
      id: "cat-code",
      name: "Development",
      skills: [
        {
          id: "skill-react",
          name: "React",
          category: "cat-code",
          sub_skills: [
            { id: "sub-next", name: "Next.js", skill: "skill-react" },
          ],
        },
      ],
    },
  ]);

  it("builds selected chips for skills and sub-skills with context", () => {
    expect(
      buildSkillSelectionChips(categories, ["skill-ui"], ["sub-next"]),
    ).toEqual([
      { id: "skill-ui", kind: "skill", name: "UI Design", context: "Design" },
      {
        id: "sub-next",
        kind: "subSkill",
        name: "Next.js",
        context: "Development / React",
      },
    ]);
  });

  it("uses fallback names for selected IDs missing from the current taxonomy page", () => {
    expect(
      buildSkillSelectionChips(
        categories,
        ["skill-legacy"],
        ["sub-legacy"],
        [{ id: "skill-legacy", name: "Legacy Skill" }],
        [{ id: "sub-legacy", name: "Legacy Sub-skill" }],
      ),
    ).toEqual([
      {
        id: "skill-legacy",
        kind: "skill",
        name: "Legacy Skill",
        context: undefined,
      },
      {
        id: "sub-legacy",
        kind: "subSkill",
        name: "Legacy Sub-skill",
        context: undefined,
      },
    ]);
  });

  it("filters by category, skill, and sub-skill names", () => {
    expect(
      filterSkillCategories(categories, "design", "all").map(
        (category) => category.id,
      ),
    ).toEqual(["cat-design"]);
    expect(
      filterSkillCategories(categories, "react", "all")[0].skills?.map(
        (skill) => skill.id,
      ),
    ).toEqual(["skill-react"]);
    expect(
      filterSkillCategories(
        categories,
        "wire",
        "all",
      )[0].skills?.[0].subSkills?.map((subSkill) => subSkill.id),
    ).toEqual(["sub-wireframes"]);
  });

  it("keeps selected counts independent from the active category filter", () => {
    const filtered = filterSkillCategories(categories, "", "cat-code");

    expect(filtered.map((category) => category.id)).toEqual(["cat-code"]);
    expect(
      countSelectedInCategory(categories[0], ["skill-ui"], ["sub-wireframes"]),
    ).toBe(2);
    expect(
      buildTechnicianSkillsPayload({
        categories: ["cat-design", "cat-code"],
        skills: ["skill-ui", "skill-react"],
        sub_skills: ["sub-wireframes"],
      }),
    ).toEqual({
      categories: ["cat-design", "cat-code"],
      skills: ["skill-ui", "skill-react"],
      sub_skills: ["sub-wireframes"],
    });
  });
});
