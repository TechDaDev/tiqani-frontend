import { expect, test } from "@playwright/test";
import { mkdtemp, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { loginAsApprovedTechnician } from "../fixtures/auth";

const ONE_PIXEL_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";

async function createTinyImage() {
  const directory = await mkdtemp(path.join(tmpdir(), "tiqani-profile-image-"));
  const filePath = path.join(directory, "avatar.png");
  await writeFile(filePath, Buffer.from(ONE_PIXEL_PNG, "base64"));
  return filePath;
}

test.describe("technician profile image", () => {
  test("renders an uploaded profile image immediately and after reload", async ({
    page,
  }) => {
    await loginAsApprovedTechnician(page);
    await page.goto("/en/profile/technician");

    const imagePath = await createTinyImage();
    await page.setInputFiles("#profileImage", imagePath);

    const avatarImage = page.locator('[data-testid="profile-avatar"] img');
    await expect(avatarImage).toBeVisible({ timeout: 20_000 });
    await expect(avatarImage).toHaveAttribute("src", /\/media\//);
    await expect
      .poll(() =>
        avatarImage.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);

    const src = await avatarImage.getAttribute("src");

    await page.reload();
    await expect(avatarImage).toBeVisible({ timeout: 20_000 });
    await expect(avatarImage).toHaveAttribute("src", src || /\/media\//);
    await expect
      .poll(() =>
        avatarImage.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  });
});
