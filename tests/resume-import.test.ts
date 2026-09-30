import { it, expect } from "vitest";
import {
  validateResumeFile,
  validateExtractedText,
  MAX_FILE_BYTES,
} from "../src/lib/resume-import";
it("aceita PDF e DOCX, inclusive extensões maiúsculas", () => {
  expect(validateResumeFile({ name: "Currículo.PDF", size: 500 })).toBe("pdf");
  expect(validateResumeFile({ name: "Currículo.docx", size: 500 })).toBe(
    "docx",
  );
});
it("rejeita tipo inválido, vazio e arquivo acima do limite", () => {
  expect(() =>
    validateResumeFile({ name: "curriculo.doc", size: 500 }),
  ).toThrow("PDF ou DOCX");
  expect(() => validateResumeFile({ name: "curriculo.pdf", size: 0 })).toThrow(
    "vazio",
  );
  expect(() =>
    validateResumeFile({ name: "curriculo.docx", size: MAX_FILE_BYTES + 1 }),
  ).toThrow("5 MB");
});
it("não trunca silenciosamente e explica ausência de texto/OCR", () => {
  expect(() => validateExtractedText(" ".repeat(20))).toThrow("OCR");
  expect(() => validateExtractedText("a".repeat(30001))).toThrow("30.000");
  expect(validateExtractedText(" Ana\r\nFormação\u0000 ")).toBe(
    "Ana\nFormação",
  );
});
