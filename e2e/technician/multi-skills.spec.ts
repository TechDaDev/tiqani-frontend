import { expect, test, type Page } from "@playwright/test";
import {
  loginAsApprovedTechnician,
  loginAsSecondTechnician,
  loginAsStaff,
  logout,
} from "../fixtures/auth";

type CategoryNode = {
  id: string;
  name: string;
  skills?: Array<{
    id: string;
    name: string;
    sub_skills?: Array<{ id: string; name: string }>;
  }>;
};

async function loadUsableTaxonomy(page: Page) {
  const response = await page.request.get(
    "/api/reference/categories?page_size=100",
  );
  expect(response.ok()).toBeTruthy();
  const data = (await response.json()) as { results: CategoryNode[] };
  const categories = data.results.filter(
    (category) => (category.skills ?? []).length > 0,
  );
  expect(categories.length).toBeGreaterThanOrEqual(2);
  return {
    first: categories[0],
    second: categories[1],
    firstSkill: categories[0].skills![0],
    secondSkill: categories[1].skills![0],
    firstSubSkill: categories[0].skills![0].sub_skills?.[0],
    secondSubSkill: categories[1].skills![0].sub_skills?.[0],
  };
}

async function clearTechnicianSkills(page: Page) {
  const response = await page.request.patch("/api/technicians/me/skills", {
    data: { categories: [], skills: [], sub_skills: [] },
  });
  expect(response.ok()).toBeTruthy();
}

test.describe.serial("technician multi-skill selection", () => {
  test("requires at least one skill or sub-skill before saving", async ({
    page,
  }) => {
    await loginAsSecondTechnician(page);
    await clearTechnicianSkills(page);

    await page.goto("/en/profile/technician");
    await page.getByRole("button", { name: "Save Skills" }).click();

    await expect(
      page.getByText("Choose at least one skill or sub-skill."),
    ).toBeVisible();
  });

  test("saves multiple selections across categories and shows them to admin", async ({
    page,
  }) => {
    const taxonomy = await loadUsableTaxonomy(page);
    await loginAsApprovedTechnician(page);
    await clearTechnicianSkills(page);

    await page.goto("/en/profile/technician");
    await expect(
      page.getByRole("heading", { name: "Skills & Services" }),
    ).toBeVisible();
    await expect(page.getByText("Available skills")).toBeVisible();
    const search = page.getByPlaceholder("Search skills and sub-skills");
    await expect(search).toBeVisible();
    await expect(page.locator("details")).toHaveCount(0);

    await search.fill(taxonomy.secondSkill.name);
    await page.getByLabel(taxonomy.secondSkill.name, { exact: true }).check();
    await expect(
      page.getByRole("button", {
        name: `Remove skill: ${taxonomy.secondSkill.name}`,
      }),
    ).toBeVisible();

    await search.fill("");
    await page
      .getByRole("button", { name: taxonomy.first.name, exact: true })
      .click();
    await expect(
      page.getByRole("button", {
        name: `Remove skill: ${taxonomy.secondSkill.name}`,
      }),
    ).toBeVisible();
    await page.getByLabel(taxonomy.firstSkill.name, { exact: true }).check();
    if (taxonomy.firstSubSkill) {
      await page
        .getByLabel(taxonomy.firstSubSkill.name, { exact: true })
        .check();
    }

    await page
      .getByRole("button", { name: taxonomy.second.name, exact: true })
      .click();
    await expect(
      page.getByRole("button", {
        name: `Remove skill: ${taxonomy.firstSkill.name}`,
      }),
    ).toBeVisible();
    if (taxonomy.secondSubSkill) {
      await page
        .getByLabel(taxonomy.secondSubSkill.name, { exact: true })
        .check();
    }

    await page.getByRole("button", { name: "Save Skills" }).click();
    await expect(page.getByText("Skills saved successfully.")).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(
      page.getByLabel(taxonomy.firstSkill.name, { exact: true }),
    ).toBeChecked();
    await expect(
      page.getByLabel(taxonomy.secondSkill.name, { exact: true }),
    ).toBeChecked();

    const saved = await page.request.get("/api/technicians/me/skills");
    expect(saved.ok()).toBeTruthy();
    const savedData = (await saved.json()) as {
      skills: string[];
      sub_skills: string[];
    };
    expect(savedData.skills).toEqual(
      expect.arrayContaining([taxonomy.firstSkill.id, taxonomy.secondSkill.id]),
    );

    await logout(page);
    await loginAsStaff(page);
    const adminList = await page.request.get(
      "/api/admin/technicians/?search=e2e_approved_tech",
    );
    expect(adminList.ok()).toBeTruthy();
    const adminData = (await adminList.json()) as {
      results: Array<{ id: string; username: string }>;
    };
    const technician = adminData.results.find(
      (item) => item.username === "e2e_approved_tech",
    );
    expect(technician).toBeTruthy();

    await page.goto(`/en/admin/technicians/${technician!.id}`);
    await expect(page.getByText(taxonomy.firstSkill.name)).toBeVisible();
    await expect(page.getByText(taxonomy.secondSkill.name)).toBeVisible();
  });
});
