import { it, expect } from "vitest";
import { analyze, priorityFor, calculateMatch } from "../src/lib/analysis";
import {
  createResumeEdits,
  applyResumeEdits,
  validateIntegrity,
} from "../src/lib/resume";
import { checkResume } from "../src/lib/checklist";
import { appendConfirmedExperience } from "../src/lib/supplement";
import { exampleJob, exampleResume } from "../src/lib/example";
it("separa prioridades explícitas, não inventa obrigatoriedade e pondera o match", () => {
  const result = analyze(exampleJob, exampleResume);
  expect(
    result.requirements
      .filter((r) => r.priority === "REQUIRED")
      .map((r) => r.requirement),
  ).toEqual(["JavaScript", "React", "Git"]);
  expect(result.requirements).toHaveLength(5);
  expect(result.matchScore).toBe(56);
  expect(priorityFor("Python e Git", ["Python"])).toBe("UNSPECIFIED");
  expect(
    priorityFor("Obrigatórios:\nPython\nBenefícios:\nDocker", ["Docker"]),
  ).toBe("UNSPECIFIED");
  expect(priorityFor("React obrigatório; Docker desejável", ["React"])).toBe(
    "REQUIRED",
  );
  expect(priorityFor("React obrigatório; Docker desejável", ["Docker"])).toBe(
    "DESIRED",
  );
  expect(calculateMatch([])).toBe(0);
});
it("aceita e rejeita sugestões isoladas sem alterar fatos nem linhas semelhantes", () => {
  const original = "Ana\nHabilidades\n  Python, Git  \nFormação\nCurso A, 2020";
  const changes = createResumeEdits(original);
  expect(applyResumeEdits(original, [])).toBe(original);
  const onlyHeading = applyResumeEdits(original, [changes[0].id]);
  expect(onlyHeading).toContain("COMPETÊNCIAS");
  expect(onlyHeading).toContain("  Python, Git  ");
  expect(validateIntegrity(original, onlyHeading)).toBe(true);
  expect(validateIntegrity(original, onlyHeading.replace("2020", "2025"))).toBe(
    false,
  );
});
it("detecta problemas reais de formatação e informa limites visuais", () => {
  const list = checkResume(
    "Ana\nHabilidades\nFormação\nCurso A\nProjeto exemplo repetido\nProjeto exemplo repetido\n| nome | dado |",
  );
  for (const id of ["contact", "empty", "duplicates", "layout"])
    expect(list.find((i) => i.id === id)?.status).toBe("ATTENTION");
  expect(list.find((i) => i.id === "visual")?.status).toBe("MANUAL");
  expect(
    checkResume(exampleResume).find((i) => i.id === "contact")?.status,
  ).toBe("PASS");
});
it("só inclui relato literal confirmado, nunca injeta a competência da pergunta", () => {
  const details = "Desenvolvi interfaces com React em um projeto acadêmico.";
  expect(() =>
    appendConfirmedExperience(exampleResume, details, false),
  ).toThrow("Confirme");
  expect(() => appendConfirmedExperience(exampleResume, "Sim", true)).toThrow(
    "30 caracteres",
  );
  const updated = appendConfirmedExperience(exampleResume, details, true);
  expect(updated).toBe(
    `${exampleResume}\n\nINFORMAÇÕES COMPLEMENTARES\n${details}`,
  );
  expect(updated).not.toContain("Docker");
  expect(analyze(exampleJob, updated).keywordsFound).toContain("React");
  expect(() =>
    appendConfirmedExperience("a".repeat(30000), details, true),
  ).toThrow("30.000");
});
