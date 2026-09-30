import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("fluxo completo, privacidade e acessibilidade", async ({
  page,
  context,
}, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Analisar currículo" }),
  ).toBeDisabled();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .getByLabel("Descrição da vaga", { exact: true })
    .fill("Conhecimento em React, JavaScript e Docker.");
  await page
    .getByLabel("Seu currículo", { exact: true })
    .fill("Desenvolvimento de aplicações utilizando JavaScript.");
  await page.getByRole("button", { name: "Analisar currículo" }).click();
  await expect(
    page.getByText("Analisando compatibilidade...").first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Resultado da análise" }),
  ).toBeVisible();
  const editor = page.getByLabel("Revise e edite seu currículo");
  await expect(editor).toHaveValue(
    "Desenvolvimento de aplicações utilizando JavaScript.",
  );
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "33",
  );
  await editor.fill(
    "Ana Silva\nEXPERIÊNCIA PROFISSIONAL\nDesenvolvimento com JavaScript.",
  );
  await page.getByRole("button", { name: "Copiar currículo" }).click();
  await expect(page.getByText("Currículo copiado com sucesso.")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Ana Silva",
  );
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar PDF" }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe("curriculo-ats.pdf");
  await file.saveAs(testInfo.outputPath("curriculo-ats.pdf"));
  await expect(page.locator("[data-sonner-toast][data-front=true]")).toHaveCSS(
    "opacity",
    "1",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath("resultado.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Nova análise" }).click();
  await expect(
    page.getByLabel("Descrição da vaga", { exact: true }),
  ).toBeFocused();
  await expect(
    page.getByLabel("Seu currículo", { exact: true }),
  ).not.toBeEmpty();
  await page
    .getByLabel("Descrição da vaga", { exact: true })
    .fill("Esta é uma descrição sem competências identificáveis.");
  await page.getByRole("button", { name: "Analisar currículo" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Não identificamos requisitos",
  );
  await expect(
    page.getByLabel("Seu currículo", { exact: true }),
  ).not.toBeEmpty();
  expect(errors).toEqual([]);
});
