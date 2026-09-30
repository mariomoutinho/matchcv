import { test, expect } from "@playwright/test";
import { jsPDF } from "jspdf";
import AxeBuilder from "@axe-core/playwright";
const original = "Meu currículo existente com experiência em Python.";
const pdfFile = (doc: jsPDF) => ({
  name: "curriculo.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from(doc.output("arraybuffer")),
});
test("importa PDF e DOCX com revisão, edição e cancelamento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const external: string[] = [];
  page.on("request", (request) => {
    if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      external.push(request.url());
  });
  await page.goto("/");
  await page.getByLabel("Seu currículo", { exact: true }).fill(original);
  await page
    .getByLabel("Descrição da vaga", { exact: true })
    .fill("Experiência com JavaScript e Git.");
  const input = page.getByLabel("Selecionar arquivo do currículo");
  const doc = new jsPDF();
  doc.text("Ana Exemplo", 20, 20);
  doc.text("JavaScript e Git", 20, 30);
  doc.addPage();
  doc.text("Experiencia profissional em desenvolvimento.", 20, 20);
  await input.setInputFiles(pdfFile(doc));
  const review = page.getByLabel("Texto extraído do arquivo");
  await expect(review).toHaveValue(
    /Ana Exemplo[\s\S]*JavaScript e Git[\s\S]*Experiencia profissional/,
  );
  await expect(review).toBeFocused();
  await expect(page.getByLabel("Seu currículo", { exact: true })).toHaveValue(
    original,
  );
  await expect(
    page.getByRole("button", { name: "Analisar currículo" }),
  ).toBeDisabled();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Cancelar importação" }).click();
  await expect(page.getByLabel("Seu currículo", { exact: true })).toHaveValue(
    original,
  );
  await input.setInputFiles(pdfFile(doc));
  await expect(review).toHaveValue(/Ana Exemplo/);
  await review.fill(
    "Ana Exemplo\nDesenvolvimento utilizando JavaScript e Git.",
  );
  await page.getByRole("button", { name: "Usar texto revisado" }).click();
  await expect(page.getByLabel("Seu currículo", { exact: true })).toHaveValue(
    "Ana Exemplo\nDesenvolvimento utilizando JavaScript e Git.",
  );
  await page.getByRole("button", { name: "Analisar currículo" }).click();
  await expect(
    page.getByRole("heading", { name: "Resultado da análise" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Modo escuro", exact: true }).click();
  await input.setInputFiles("e2e/fixtures/curriculo.docx");
  await expect(review).toHaveValue(/Graduação em Ciência da Computação, 2024/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Usar texto revisado" }).click();
  await expect(
    page.getByRole("heading", { name: "Resultado da análise" }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Seu currículo", { exact: true })).toHaveValue(
    /JavaScript e Git/,
  );
  expect(external).toEqual([]);
});
test("preserva texto ao rejeitar arquivo inválido, vazio, grande, corrompido ou sem texto", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Seu currículo", { exact: true }).fill(original);
  const input = page.getByLabel("Selecionar arquivo do currículo");
  for (const [name, buffer, message] of [
    ["curriculo.doc", Buffer.from("doc antigo"), "PDF ou DOCX"],
    ["curriculo.pdf", Buffer.alloc(0), "vazio"],
    ["curriculo.pdf", Buffer.alloc(5 * 1024 * 1024 + 1), "5 MB"],
    ["curriculo.pdf", Buffer.from("PDF inválido"), "Não foi possível ler"],
    ["curriculo.docx", Buffer.from("DOCX inválido"), "Não foi possível ler"],
  ] as const) {
    await input.setInputFiles({
      name,
      mimeType: "application/octet-stream",
      buffer,
    });
    await expect(page.getByRole("alert")).toContainText(message);
    await expect(page.getByLabel("Seu currículo", { exact: true })).toHaveValue(
      original,
    );
  }
  const empty = new jsPDF();
  empty.rect(10, 10, 100, 100);
  await input.setInputFiles(pdfFile(empty));
  await expect(page.getByRole("alert")).toContainText("OCR");
  const protectedPdf = new jsPDF({ encryption: { userPassword: "test-only" } });
  protectedPdf.text("JavaScript", 20, 20);
  await input.setInputFiles(pdfFile(protectedPdf));
  await expect(page.getByRole("alert")).toContainText("senha");
  await expect(page.getByLabel("Seu currículo", { exact: true })).toHaveValue(
    original,
  );
});
