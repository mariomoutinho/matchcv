import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const url = process.argv[2] ?? "http://127.0.0.1:4173/";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(url);
  expect(response?.ok()).toBe(true);
  await page.getByRole("button", { name: "Usar exemplo fictício" }).click();
  await mkdir("docs/screenshots", { recursive: true });
  await mkdir("docs/examples", { recursive: true });
  await writeFile(
    "docs/examples/vaga.txt",
    (await page.getByLabel("Descrição da vaga", { exact: true }).inputValue()) +
      "\n",
  );
  await writeFile(
    "docs/examples/curriculo.txt",
    (await page.getByLabel("Seu currículo", { exact: true }).inputValue()) +
      "\n",
  );
  await page.getByRole("button", { name: "Analisar currículo" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "56",
  );
  await page
    .locator(".results")
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: "docs/screenshots/analise-desktop.png" });
  await page
    .locator("#comparison")
    .getByRole("button", { name: "Aceitar", exact: true })
    .first()
    .click();
  await page
    .locator("#comparison")
    .screenshot({ path: "docs/screenshots/comparacao.png" });
  await page.getByRole("button", { name: "Modo escuro", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 900 });
  await page
    .locator(".results")
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: "docs/screenshots/mobile-escuro.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  console.log(
    JSON.stringify(
      {
        url,
        httpStatus: response.status(),
        match: 56,
        screenshots: 3,
        errors,
        checkedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
