import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("exemplo, prioridades, decisões individuais e relato confirmado", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Usar exemplo fictício" }).click();
  await page.getByRole("button", { name: "Analisar currículo" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "56",
  );
  await expect(page.locator("#requirement-priorities")).toContainText(
    "Obrigatório · 3",
  );
  await expect(page.locator("#requirement-priorities")).toContainText(
    "Desejável · 2",
  );
  const first = page.getByRole("group", {
    name: "Alteração na linha 4",
    exact: true,
  });
  const edit = page.getByLabel("Revise e edite seu currículo");
  await first.getByRole("button", { name: "Aceitar", exact: true }).click();
  await expect(edit).toHaveValue(/RESUMO PROFISSIONAL/);
  await first.getByRole("button", { name: "Rejeitar", exact: true }).click();
  await expect(edit).not.toHaveValue(/RESUMO PROFISSIONAL/);
  await first.getByRole("button", { name: "Aceitar", exact: true }).click();
  await expect(page.locator("#ats-checklist")).toContainText(
    "Conferir manualmente",
  );
  await page.getByLabel("Requisito a esclarecer").selectOption("React");
  await page.getByLabel("Não possuo", { exact: true }).check();
  await expect(edit).not.toHaveValue(/React/);
  await page.getByLabel("Sim, tenho experiência", { exact: true }).check();
  const add = page.getByRole("button", {
    name: "Adicionar relato e reanalisar",
  });
  await expect(add).toBeDisabled();
  await page
    .getByLabel("Conte o que você realmente fez")
    .fill("Desenvolvi interfaces com React em um projeto acadêmico.");
  await expect(add).toBeDisabled();
  await page
    .getByLabel("Confirmo que o relato é verdadeiro", { exact: false })
    .check();
  await add.click();
  await expect(page.getByLabel("Seu currículo", { exact: true })).toHaveValue(
    /Desenvolvi interfaces com React em um projeto acadêmico\./,
  );
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "81",
  );
  await expect(edit).not.toHaveValue(/Docker/);
  await expect(page.locator("#experience-questions")).toContainText("Docker");
  await edit.fill("Ana Exemplo\nana@example.com\nAlteração manual preservada.");
  await expect(
    page
      .locator("#comparison")
      .getByRole("button", { name: "Aceitar", exact: true })
      .first(),
  ).toBeDisabled();
  await expect(page.locator("#ats-checklist")).toContainText(
    "Use títulos claros",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
