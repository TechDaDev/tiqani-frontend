import { expect, type Page } from "@playwright/test";

export async function openContractReview(page: Page, contractId: string, locale = "en") {
  await page.goto(`/${locale}/contracts/${contractId}/review`);
  await page.waitForLoadState("networkidle");
}

export async function expectReviewEligible(page: Page) {
  await expect(page.getByTestId("review-page")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("review-form")).toBeVisible();
}

export async function expectReviewIneligible(page: Page, reason: RegExp) {
  await expect(page.getByTestId("review-eligibility")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("review-form")).toHaveCount(0);
  await expect(page.getByTestId("review-eligibility")).toContainText(reason);
}

export async function submitReview(page: Page, data: { rating: number; title: string; comment: string }) {
  await page.getByTestId(`review-rating-${data.rating}`).click();
  await page.getByTestId("review-title").fill(data.title);
  await page.getByTestId("review-comment").fill(data.comment);
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/contracts/") &&
    response.url().includes("/reviews") &&
    response.request().method() === "POST" &&
    [200, 201].includes(response.status())
  );
  await page.getByTestId("review-submit").click();
  const response = await responsePromise;
  expect([200, 201]).toContain(response.status());
}

export async function fetchEligibility(page: Page, contractId: string) {
  const response = await page.request.get(`/api/contracts/${contractId}/review-eligibility/`);
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<{
    eligible: boolean;
    reason_code: string;
    reviewee?: { id: string; username: string; role: string } | null;
    existing_review?: string | null;
    editable: boolean;
  }>;
}

export async function openUserReviews(page: Page, userId: string, locale = "en") {
  await page.goto(`/${locale}/users/${userId}/reviews`);
  await page.waitForLoadState("networkidle");
}
