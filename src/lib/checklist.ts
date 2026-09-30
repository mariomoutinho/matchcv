import { resumeHeading } from "./resume";
export interface ChecklistItem {
  id: string;
  label: string;
  status: "PASS" | "ATTENTION" | "MANUAL";
  detail: string;
}
export function checkResume(text: string): ChecklistItem[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const titles = lines.filter((line) => resumeHeading(line));
  const contact =
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?55\s*)?\(?\d{2}\)?[\s.-]*\d{4,5}[\s.-]*\d{4}/i.test(
      text,
    );
  const empty = lines.filter(
    (line, i) =>
      resumeHeading(line) && (!lines[i + 1] || resumeHeading(lines[i + 1])),
  );
  const seen = new Set<string>(),
    duplicates = new Set<string>();
  for (const line of lines) {
    const key = line.toLocaleLowerCase("pt-BR");
    if (seen.has(key) && line.length > 12) duplicates.add(line);
    seen.add(key);
  }
  const complex = lines.some((line) => /\t|\S\s{4,}\S|\|.*\|/.test(line));
  return [
    {
      id: "contact",
      label: "Contato disponível",
      status: contact ? "PASS" : "ATTENTION",
      detail: contact
        ? "Identificamos e-mail ou telefone no texto."
        : "Inclua um e-mail profissional ou telefone, se desejar ser contatado. Não é necessário informar CPF ou RG.",
    },
    {
      id: "headings",
      label: "Títulos tradicionais",
      status: titles.length ? "PASS" : "ATTENTION",
      detail: titles.length
        ? "Há seções reconhecíveis, como Experiência, Formação ou Competências."
        : "Use títulos claros para separar suas informações: Experiência profissional, Projetos, Formação e Competências, conforme seu conteúdo.",
    },
    {
      id: "empty",
      label: "Seções com conteúdo",
      status: empty.length ? "ATTENTION" : "PASS",
      detail: empty.length
        ? `Revise estas seções aparentemente vazias: ${empty.join(", ")}.`
        : "Não identificamos títulos reconhecidos sem conteúdo.",
    },
    {
      id: "duplicates",
      label: "Informações duplicadas",
      status: duplicates.size ? "ATTENTION" : "PASS",
      detail: duplicates.size
        ? `Encontramos ${duplicates.size} linha(s) repetida(s). Confira se são necessárias: ${[...duplicates].slice(0, 3).join(" / ")}.`
        : "Não encontramos linhas longas idênticas repetidas.",
    },
    {
      id: "layout",
      label: "Estrutura linear",
      status: complex ? "ATTENTION" : "PASS",
      detail: complex
        ? "Há sinais de tabelas ou colunas no texto. Prefira uma coluna com uma informação por linha."
        : "Não detectamos tabulações ou separadores típicos de tabelas no texto.",
    },
    {
      id: "visual",
      label: "Conferência visual do documento",
      status: "MANUAL",
      detail:
        "Revise o PDF final: fonte legível, texto selecionável, sem fotos ou barras de habilidade. O texto extraído não permite avaliar o layout original com certeza.",
    },
  ];
}
