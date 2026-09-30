import { generateResume, validateIntegrity } from "./resume";
export type RequirementStatus = "FOUND" | "PARTIAL" | "NOT_FOUND";
export type RequirementPriority = "REQUIRED" | "DESIRED" | "UNSPECIFIED";
export const priorityLabels: Record<RequirementPriority, string> = {
  REQUIRED: "Obrigatório",
  DESIRED: "Desejável",
  UNSPECIFIED: "Não especificado",
};
export const priorityWeights: Record<RequirementPriority, number> = {
  REQUIRED: 2,
  DESIRED: 1,
  UNSPECIFIED: 1,
};
export interface RequirementAnalysis {
  priority: RequirementPriority;
  requirement: string;
  status: RequirementStatus;
  evidence?: string;
}
export interface AnalysisResult {
  matchScore: number;
  keywordsFound: string[];
  keywordsPartial: string[];
  keywordsMissing: string[];
  requirements: RequirementAnalysis[];
  suggestions: string[];
  optimizedResume: string;
}
export const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const vocabulary: Record<string, string[]> = {
  JavaScript: ["javascript", "js"],
  TypeScript: ["typescript"],
  React: ["react", "reactjs", "react.js"],
  Git: ["git"],
  Docker: ["docker"],
  Python: ["python"],
  AWS: ["aws", "amazon web services"],
  HTML: ["html", "html5"],
  CSS: ["css", "css3"],
  "Node.js": ["node.js", "nodejs"],
  SQL: ["sql"],
  PostgreSQL: ["postgresql", "postgres"],
  MySQL: ["mysql"],
  Java: ["java"],
  "C++": ["c++"],
  "C#": ["c#"],
  ".NET": [".net", "dotnet"],
  PHP: ["php"],
  Angular: ["angular"],
  Vue: ["vue", "vue.js"],
  "REST API": ["rest api", "api rest", "apis rest", "restful"],
  Automação: ["automacao", "automacoes"],
  n8n: ["n8n"],
  Excel: ["excel"],
  "Power BI": ["power bi"],
  Figma: ["figma"],
  Scrum: ["scrum"],
  Kanban: ["kanban"],
  Agile: ["agile", "agil", "ageis"],
  Linux: ["linux"],
  Kubernetes: ["kubernetes"],
  Azure: ["azure"],
  "Google Cloud": ["google cloud", "gcp"],
  "Front-end": ["front-end", "frontend", "front end"],
  "Back-end": ["back-end", "backend", "back end"],
  "Análise de dados": ["analise de dados"],
  "Atendimento ao cliente": ["atendimento ao cliente"],
  Vendas: ["vendas"],
  Comunicação: ["comunicacao"],
  Liderança: ["lideranca"],
  "Trabalho em equipe": ["trabalho em equipe"],
  Organização: ["organizacao"],
  Inglês: ["ingles", "english"],
  Espanhol: ["espanhol"],
  Graduação: ["graduacao", "ensino superior"],
  "Ciência da computação": ["ciencia da computacao"],
  "Engenharia de software": ["engenharia de software"],
  Mestrado: ["mestrado"],
  Doutorado: ["doutorado"],
  CPA: ["cpa-10", "cpa-20"],
  PMP: ["pmp"],
};
function contains(text: string, term: string) {
  const escaped = normalizeText(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+#])${escaped}($|[^a-z0-9+#])`, "i").test(
    normalizeText(text),
  );
}
const lines = (text: string) =>
  text
    .split(/\n|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
const negated = (text: string, term: string) => {
  const n = normalizeText(text);
  const i = n.indexOf(normalizeText(term));
  return /\b(nao|sem|nenhum|nunca|no|not)\b/.test(
    n.slice(Math.max(0, i - 70), i),
  );
};
function isPriorityHeading(text: string): boolean {
  return /^(?:(?:requisitos|qualificacoes|competencias)\s+)?(?:obrigatorios?|obrigatorias?|desejaveis|diferenciais(?:\s+desejaveis)?|essenciais)[:\s]*$/.test(
    normalizeText(text).replace(/^#+\s*/, ""),
  );
}
function explicitPriority(text: string): RequirementPriority | undefined {
  const n = normalizeText(text);
  if (/nao\s+(?:e\s+)?obrigatori/.test(n)) return "UNSPECIFIED";
  if (/desejave|desejavel|diferencia|preferencia|opciona|nice.to.have/.test(n))
    return "DESIRED";
  if (
    /obrigatori|essencia|indispensave|indispensavel|necessari|must.have/.test(n)
  )
    return "REQUIRED";
}
export function priorityFor(job: string, terms: string[]): RequirementPriority {
  let section: RequirementPriority = "UNSPECIFIED";
  const matches: RequirementPriority[] = [];
  for (const raw of job.split("\n")) {
    const line = raw.trim();
    const normalized = normalizeText(line).replace(/[:#*]/g, "").trim();
    // Inherit only short, explicit section headings; benefits/responsibilities reset it.
    const heading = isPriorityHeading(line);
    const explicit = explicitPriority(line);
    if (heading && explicit) section = explicit;
    else if (
      /^(responsabilidades|atividades|beneficios|sobre a (vaga|empresa)|requisitos|qualificacoes)$/.test(
        normalized,
      )
    )
      section = "UNSPECIFIED";
    for (const clause of line.split(/;\s*|(?<=[.!?])\s+/)) {
      if (terms.some((term) => contains(clause, term)))
        matches.push(explicitPriority(clause) ?? section);
    }
  }
  return matches.includes("REQUIRED")
    ? "REQUIRED"
    : matches.includes("DESIRED")
      ? "DESIRED"
      : "UNSPECIFIED";
}
export function calculateMatch(requirements: RequirementAnalysis[]): number {
  const total = requirements.reduce(
    (sum, r) => sum + priorityWeights[r.priority],
    0,
  );
  const points = requirements.reduce(
    (sum, r) =>
      sum +
      priorityWeights[r.priority] *
        (r.status === "FOUND" ? 1 : r.status === "PARTIAL" ? 0.5 : 0),
    0,
  );
  return total ? Math.round((100 * points) / total) : 0;
}
export function analyze(job: string, resume: string): AnalysisResult {
  if (!job.trim() || !resume.trim())
    throw new Error("Preencha a vaga e o currículo.");
  if (job.length > 30000 || resume.length > 30000)
    throw new Error("Use até 30.000 caracteres em cada campo.");
  const source = lines(resume);
  const entries = Object.entries(vocabulary).filter(([, aliases]) =>
    aliases.some((a) => contains(job, a)),
  );
  const requirements: RequirementAnalysis[] = entries.map(
    ([requirement, aliases]) => {
      const priority = priorityFor(job, aliases);
      const evidence = source.find((line) =>
        aliases.some((a) => contains(line, a) && !negated(line, a)),
      );
      if (evidence) return { requirement, priority, status: "FOUND", evidence };
      const related =
        requirement === "Front-end"
          ? ["html", "css", "javascript"]
          : requirement === "Back-end"
            ? ["node.js", "python", "java"]
            : [];
      const partial = source.find((line) =>
        related.some((a) => contains(line, a) && !negated(line, a)),
      );
      return {
        requirement,
        priority,
        status: partial ? "PARTIAL" : "NOT_FOUND",
        evidence: partial,
      };
    },
  );
  // Retain uncatalogued requirements as whole phrases: no unsupported semantic guesses.
  for (const line of lines(job)) {
    const phrase = line.replace(/^\s*(?:[-•*]\s*|\d+[.)]\s+)/, "").trim();
    if (isPriorityHeading(phrase)) continue;
    if (
      phrase.length < 8 ||
      phrase.length > 240 ||
      !(
        /^[\s]*[-•*]/.test(line) ||
        /requisit|obrigat|desejav|experiencia|responsav|certifica|\banos\b/.test(
          normalizeText(phrase),
        )
      )
    )
      continue;
    const known = entries.some(([, aliases]) =>
      aliases.some((a) => contains(phrase, a)),
    );
    const qualified =
      /\b\d+\s*anos|avancad|fluent|intermediari|certifica|experiencia.*\banos\b/.test(
        normalizeText(phrase),
      );
    if (known && !qualified) continue;
    const evidence = source.find(
      (s) => contains(s, phrase) && !negated(s, phrase),
    );
    if (!requirements.some((r) => r.requirement === phrase))
      requirements.push({
        requirement: phrase,
        priority: priorityFor(job, [phrase]),
        status: evidence ? "FOUND" : "NOT_FOUND",
        evidence,
      });
  }
  if (!requirements.length)
    throw new Error(
      "Não identificamos requisitos nesta descrição. Inclua competências e responsabilidades da vaga em uma lista clara.",
    );
  const keywordsFound = requirements
    .filter((r) => r.status === "FOUND")
    .map((r) => r.requirement);
  const keywordsPartial = requirements
    .filter((r) => r.status === "PARTIAL")
    .map((r) => r.requirement);
  const keywordsMissing = requirements
    .filter((r) => r.status === "NOT_FOUND")
    .map((r) => r.requirement);
  const optimizedResume = generateResume(resume);
  if (!validateIntegrity(resume, optimizedResume))
    throw new Error("Não foi possível validar a integridade do currículo.");
  return {
    requirements,
    keywordsFound,
    keywordsPartial,
    keywordsMissing,
    optimizedResume,
    matchScore: calculateMatch(requirements),
    suggestions: [
      ...keywordsFound.map(
        (k) =>
          `${k} aparece nos dois textos. Considere dar destaque à experiência que demonstra essa competência.`,
      ),
      ...keywordsPartial.map(
        (k) =>
          `Há experiência relacionada a ${k}, mas ela não comprova o requisito completo. Explique melhor somente o que você já realizou.`,
      ),
      ...keywordsMissing.map(
        (k) =>
          `A vaga menciona ${k}, mas não encontramos evidência no currículo. Inclua essa informação somente se você realmente possuir essa experiência ou qualificação.`,
      ),
    ],
  };
}
