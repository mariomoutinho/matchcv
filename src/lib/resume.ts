// Only known section headings may change. Every factual line must remain literal.
const headings: Record<string, string> = {
  resumo: "RESUMO PROFISSIONAL",
  perfil: "RESUMO PROFISSIONAL",
  "perfil profissional": "RESUMO PROFISSIONAL",
  "resumo profissional": "RESUMO PROFISSIONAL",
  contato: "CONTATO",
  contatos: "CONTATO",
  competencias: "COMPETÊNCIAS",
  habilidades: "COMPETÊNCIAS",
  "habilidades tecnicas": "COMPETÊNCIAS",
  experiencia: "EXPERIÊNCIA PROFISSIONAL",
  experiencias: "EXPERIÊNCIA PROFISSIONAL",
  "experiencia profissional": "EXPERIÊNCIA PROFISSIONAL",
  "experiencias profissionais": "EXPERIÊNCIA PROFISSIONAL",
  projetos: "PROJETOS",
  formacao: "FORMAÇÃO",
  "formacao academica": "FORMAÇÃO",
  educacao: "FORMAÇÃO",
  certificacoes: "CERTIFICAÇÕES",
  idiomas: "IDIOMAS",
  "informacoes complementares": "INFORMAÇÕES COMPLEMENTARES",
};
export const resumeHeading = (line: string): string | undefined => {
  const key = line
    .replace(/^#+\s*/, "")
    .replace(/:$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return Object.hasOwn(headings, key) ? headings[key] : undefined;
};
export interface ResumeEdit {
  id: number;
  original: string;
  proposed: string;
  reason: string;
}
export function createResumeEdits(original: string): ResumeEdit[] {
  const lines = original.split("\n");
  return lines.flatMap((line, index) => {
    const trimmed = line.trim();
    const title = resumeHeading(trimmed);
    const previousLine = lines[index - 1];
    const proposed = title
      ? `${previousLine?.trim() ? "\n" : ""}${title}`
      : trimmed;
    return proposed === line
      ? []
      : [
          {
            id: index,
            original: line,
            proposed,
            reason: title
              ? "Padronizar título e separar a seção."
              : "Remover espaços desnecessários sem alterar o conteúdo.",
          },
        ];
  });
}
export function applyResumeEdits(original: string, accepted: number[]): string {
  const selected = new Set(accepted);
  const lines = original.split("\n");
  for (const edit of createResumeEdits(original))
    if (selected.has(edit.id)) lines[edit.id] = edit.proposed;
  return lines.join("\n");
}
export function generateResume(original: string): string {
  return applyResumeEdits(
    original,
    createResumeEdits(original).map((edit) => edit.id),
  );
}
export function validateIntegrity(
  original: string,
  candidate: string,
): boolean {
  const canonical = (s: string) =>
    s
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => resumeHeading(l) || l);
  const a = canonical(original),
    b = canonical(candidate);
  return a.length === b.length && a.every((line, i) => line === b[i]);
}
