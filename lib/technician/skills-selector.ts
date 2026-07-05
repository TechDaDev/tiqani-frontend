import type {
  CategoryItem,
  SkillItem,
  SubSkillItem,
} from "@/lib/marketplace/types";

export type SkillChip = {
  id: string;
  name: string;
  kind: "skill" | "subSkill";
  context?: string;
};

export type SkillDetailFallback = {
  id: string;
  name: string;
};

function includesText(value: string | undefined, query: string) {
  return Boolean(value?.toLowerCase().includes(query));
}

export function countSelectedInCategory(
  category: CategoryItem,
  selectedSkillIds: string[],
  selectedSubSkillIds: string[],
) {
  const selectedSkills = (category.skills ?? []).filter((skill) =>
    selectedSkillIds.includes(skill.id),
  ).length;
  const selectedSubSkills = (category.skills ?? []).reduce((count, skill) => {
    return (
      count +
      (skill.subSkills ?? []).filter((subSkill) =>
        selectedSubSkillIds.includes(subSkill.id),
      ).length
    );
  }, 0);
  return selectedSkills + selectedSubSkills;
}

export function filterSkillCategories(
  categories: CategoryItem[],
  query: string,
  activeCategoryId: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  return categories
    .filter(
      (category) =>
        activeCategoryId === "all" || category.id === activeCategoryId,
    )
    .map((category) => {
      if (!normalizedQuery) return category;
      const categoryMatches = includesText(category.name, normalizedQuery);
      const skills = (category.skills ?? [])
        .map((skill) => {
          const skillMatches = includesText(skill.name, normalizedQuery);
          const subSkills = (skill.subSkills ?? []).filter((subSkill) =>
            includesText(subSkill.name, normalizedQuery),
          );
          if (categoryMatches || skillMatches) return skill;
          if (subSkills.length) return { ...skill, subSkills };
          return null;
        })
        .filter((skill): skill is SkillItem => Boolean(skill));

      if (categoryMatches || skills.length) return { ...category, skills };
      return null;
    })
    .filter((category): category is CategoryItem => Boolean(category));
}

export function getActiveSkillCategory(
  categories: CategoryItem[],
  activeCategoryId: string,
) {
  return (
    categories.find((category) => category.id === activeCategoryId) ??
    categories[0] ??
    null
  );
}

export function buildSkillSelectionChips(
  categories: CategoryItem[],
  selectedSkillIds: string[],
  selectedSubSkillIds: string[],
  fallbackSkills: SkillDetailFallback[] = [],
  fallbackSubSkills: SkillDetailFallback[] = [],
): SkillChip[] {
  const skillsById = new Map<
    string,
    { skill: SkillItem; category: CategoryItem }
  >();
  const subSkillsById = new Map<
    string,
    { subSkill: SubSkillItem; skill: SkillItem; category: CategoryItem }
  >();

  categories.forEach((category) => {
    (category.skills ?? []).forEach((skill) => {
      skillsById.set(skill.id, { skill, category });
      (skill.subSkills ?? []).forEach((subSkill) => {
        subSkillsById.set(subSkill.id, { subSkill, skill, category });
      });
    });
  });

  const fallbackSkillNames = new Map(
    fallbackSkills.map((skill) => [skill.id, skill.name]),
  );
  const fallbackSubSkillNames = new Map(
    fallbackSubSkills.map((subSkill) => [subSkill.id, subSkill.name]),
  );

  return [
    ...selectedSkillIds.map((id): SkillChip => {
      const match = skillsById.get(id);
      return {
        id,
        kind: "skill",
        name: match?.skill.name ?? fallbackSkillNames.get(id) ?? id,
        context: match?.category.name,
      };
    }),
    ...selectedSubSkillIds.map((id): SkillChip => {
      const match = subSkillsById.get(id);
      return {
        id,
        kind: "subSkill",
        name: match?.subSkill.name ?? fallbackSubSkillNames.get(id) ?? id,
        context: match
          ? `${match.category.name} / ${match.skill.name}`
          : undefined,
      };
    }),
  ];
}
