import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TechnicianFilters, type FilterValues } from "@/components/marketplace/TechnicianFilters";

// Mock next-intl
vi.mock("next-intl", () => {
  const translations: Record<string, string> = {
    filterGroupLabel: "Filter and sort technicians",
    activeFilters: "Active filters",
    remove: "Remove",
    clearAll: "Clear all filters",
    governorate: "Governorate",
    allGovernorates: "All governorates",
    availability: "Availability",
    all: "All",
    availableOnly: "Available only",
    unavailableOnly: "Unavailable only",
    skill: "Skill",
    allSkills: "All skills",
    category: "Category",
    allCategories: "All categories",
    minRating: "Min. rating",
    anyRating: "Any rating",
    sortBy: "Sort by",
    highestRated: "Highest rated",
    lowestRated: "Lowest rated",
    mostExperienced: "Most experienced",
    leastExperienced: "Least experienced",
    nameAZ: "Name A–Z",
    nameZA: "Name Z–A",
  };
  return {
    useTranslations: () => (key: string) => translations[key] || key,
  };
});

const emptySkills: Array<{ id: string; name: string }> = [];
const emptyCategories: Array<{ id: string; name: string }> = [];

describe("TechnicianFilters", () => {
  const defaultValues: FilterValues = {
    governorate: "",
    is_available: "",
    skill_id: "",
    category_id: "",
    min_rating: "",
    order_by: "-rate",
  };

  it("renders all filter dropdowns", () => {
    render(
      <TechnicianFilters
        values={defaultValues}
        governorates={[]}
        categories={emptyCategories}
        skills={emptySkills}
        skillsLoading={false}
        categoriesLoading={false}
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText("Governorate")).toBeInTheDocument();
    expect(screen.getByLabelText("Availability")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
  });

  it("calls onChange when governorate changes", () => {
    const onChange = vi.fn();
    render(
      <TechnicianFilters
        values={defaultValues}
        governorates={["Baghdad", "Erbil", "Basra"]}
        categories={emptyCategories}
        skills={emptySkills}
        skillsLoading={false}
        categoriesLoading={false}
        onChange={onChange}
      />
    );
    const select = screen.getByLabelText("Governorate");
    fireEvent.change(select, { target: { value: "Baghdad" } });
    expect(onChange).toHaveBeenCalledWith({
      governorate: "Baghdad",
      is_available: "",
      skill_id: "",
      category_id: "",
      min_rating: "",
      order_by: "-rate",
    });
  });

  it("calls onChange when availability changes", () => {
    const onChange = vi.fn();
    render(
      <TechnicianFilters
        values={defaultValues}
        governorates={[]}
        categories={emptyCategories}
        skills={emptySkills}
        skillsLoading={false}
        categoriesLoading={false}
        onChange={onChange}
      />
    );
    const select = screen.getByLabelText("Availability");
    fireEvent.change(select, { target: { value: "true" } });
    expect(onChange).toHaveBeenCalledWith({
      governorate: "",
      is_available: "true",
      skill_id: "",
      category_id: "",
      min_rating: "",
      order_by: "-rate",
    });
  });

  it("calls onChange when sort changes", () => {
    const onChange = vi.fn();
    render(
      <TechnicianFilters
        values={defaultValues}
        governorates={[]}
        categories={emptyCategories}
        skills={emptySkills}
        skillsLoading={false}
        categoriesLoading={false}
        onChange={onChange}
      />
    );
    const select = screen.getByLabelText("Sort by");
    fireEvent.change(select, { target: { value: "years_of_expertise" } });
    expect(onChange).toHaveBeenCalledWith({
      governorate: "",
      is_available: "",
      skill_id: "",
      category_id: "",
      min_rating: "",
      order_by: "years_of_expertise",
    });
  });

  it("renders governorate options from prop", () => {
    render(
      <TechnicianFilters
        values={defaultValues}
        governorates={["Baghdad", "Erbil"]}
        categories={emptyCategories}
        skills={emptySkills}
        skillsLoading={false}
        categoriesLoading={false}
        onChange={() => {}}
      />
    );
    const select = screen.getByLabelText("Governorate");
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
    expect(options).toContain("Baghdad");
    expect(options).toContain("Erbil");
    expect(options).toContain("All governorates");
  });
});
