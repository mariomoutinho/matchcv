import { describe, it, expect } from "vitest";
import { analyze } from "../src/lib/analysis";
import { generateResume, validateIntegrity } from "../src/lib/resume";
import { createResumePdf } from "../src/lib/pdf";
describe("comparação e integridade", () => {
  it("encontra JavaScript e Git", () => {
    const r = analyze(
      "Experiência com JavaScript e Git.",
      "Desenvolvimento de projetos utilizando JavaScript e Git.",
    );
    expect(r.keywordsFound).toEqual(["JavaScript", "Git"]);
    expect(r.matchScore).toBe(100);
  });
  it("não inventa React ou Docker", () => {
    const r = analyze(
      "Conhecimento em React, JavaScript e Docker.",
      "Desenvolvimento de aplicações utilizando JavaScript.",
    );
    expect(r.keywordsMissing).toEqual(["React", "Docker"]);
    expect(r.optimizedResume).not.toMatch(/React|Docker/);
  });
  it("não inventa qualificações ou números ao gerar", () => {
    const original = "Criei automações utilizando n8n.";
    expect(validateIntegrity(original, generateResume(original))).toBe(true);
    expect(
      validateIntegrity(
        original,
        "Especialista em automação empresarial com cinco anos de experiência utilizando n8n.",
      ),
    ).toBe(false);
  });
  it("bloqueia AWS e Docker no cenário Python", () => {
    const r = analyze("Python, Docker, AWS", "Python");
    expect(r.keywordsFound).toEqual(["Python"]);
    expect(r.keywordsMissing).toEqual(["Docker", "AWS"]);
    expect(r.optimizedResume).toBe("Python");
  });
  it("não confunde Java com JavaScript ou Git com GitHub", () => {
    const r = analyze("Java e Git", "JavaScript e GitHub");
    expect(r.keywordsFound).toEqual([]);
  });
  it("reconhece termos com pontuação", () => {
    expect(analyze("C++ e C# e .NET", "C++ e C# e .NET").matchScore).toBe(100);
  });
  it("negações não contam como experiência", () => {
    expect(
      analyze("Docker", "Não tenho experiência com Docker.").keywordsMissing,
    ).toContain("Docker");
  });
  it("não infere React a partir de JavaScript", () => {
    const r = analyze("Front-end e React", "HTML, CSS e JavaScript");
    expect(r.keywordsPartial).toContain("Front-end");
    expect(r.keywordsMissing).toContain("React");
  });
  it("mantém requisitos de nível e tempo separados", () => {
    const r = analyze(
      "- Inglês fluente\n- 5 anos de experiência com Python",
      "Conhecimento em inglês e Python",
    );
    expect(r.keywordsMissing).toContain("Inglês fluente");
    expect(r.keywordsMissing).toContain("5 anos de experiência com Python");
  });
  it("evidências são trechos literais", () => {
    const original = "Ana\nCriei aplicações com Python.\nEmpresa A, 2020–2024.";
    const r = analyze("Python e Docker", original);
    r.requirements
      .filter((x) => x.evidence)
      .forEach((x) => expect(original).toContain(x.evidence));
    expect(r.optimizedResume).toBe(original);
  });
  it("rejeita vazios e descrições sem requisitos", () => {
    expect(() => analyze("", "texto")).toThrow();
    expect(() => analyze("Olá mundo", "texto")).toThrow();
  });
  it("PDF multipágina contém apenas currículo", () => {
    const pdf = createResumePdf(
      "Ana — Experiência profissional\nPython\n".repeat(100),
    );
    expect(pdf.getNumberOfPages()).toBeGreaterThan(1);
    expect(pdf.output()).toContain("%PDF");
    expect(pdf.output()).not.toContain("Match estimado");
  });
});

it("padroniza títulos sem alterar fatos", () => {
  const original =
    "Ana\nHabilidades:\nPython\nFormação acadêmica\nCurso A, 2020";
  const generated = generateResume(original);
  expect(generated).toContain("COMPETÊNCIAS");
  expect(generated).toContain("FORMAÇÃO");
  expect(validateIntegrity(original, generated)).toBe(true);
  expect(validateIntegrity(original, generated.replace("2020", "2024"))).toBe(
    false,
  );
  expect(generateResume("constructor")).toBe("constructor");
});
