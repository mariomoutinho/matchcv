import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  ShieldCheck,
  ScanLine,
  Check,
  CheckCircle2,
  CircleHelp,
  CircleMinus,
  Copy,
  Download,
  RotateCcw,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  ListChecks,
  PencilLine,
  Moon,
  Sun,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { ResumeReview } from "./components/resume-review";
import { ExperienceQuestions } from "./components/experience-questions";
import { exampleJob, exampleResume } from "./lib/example";
import { ResumeImport } from "./components/resume-import";
import { Button } from "./components/ui/button";
import {
  Alert,
  Badge,
  Card,
  Progress,
  Skeleton,
  Textarea,
} from "./components/ui/primitives";
import {
  analyze,
  type AnalysisResult,
  type RequirementStatus,
  priorityLabels,
  type RequirementPriority,
} from "./lib/analysis";

import { initialTheme, applyTheme, type Theme } from "./lib/theme";

type AppState = "EMPTY" | "READY" | "ANALYZING" | "SUCCESS" | "ERROR";
const labels: Record<RequirementStatus, string> = {
  FOUND: "Encontrado",
  PARTIAL: "Correspondência parcial",
  NOT_FOUND: "Não encontrado",
};
const icons = {
  FOUND: CheckCircle2,
  PARTIAL: CircleHelp,
  NOT_FOUND: CircleMinus,
};
export default function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  }
  const [job, setJob] = useState(""),
    [resume, setResume] = useState(""),
    [status, setStatus] = useState<AppState>("EMPTY"),
    [result, setResult] = useState<AnalysisResult | null>(null),
    [edited, setEdited] = useState(""),
    [error, setError] = useState("");
  const [importPending, setImportPending] = useState(false);
  const [analyzedResume, setAnalyzedResume] = useState("");
  const [manuallyEdited, setManuallyEdited] = useState(false);
  const [analysisVersion, setAnalysisVersion] = useState(0);
  const resultRef = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const canAnalyze = job.trim().length >= 30 && resume.trim().length >= 30;
  const change = (value: string, kind: "job" | "resume") => {
    kind === "job" ? setJob(value) : setResume(value);
    setResult(null);
    setError("");
    const nextJob = kind === "job" ? value : job;
    const nextResume = kind === "resume" ? value : resume;
    setStatus(
      nextJob.trim().length >= 30 && nextResume.trim().length >= 30
        ? "READY"
        : "EMPTY",
    );
  };
  async function handleAnalyze(resumeText = resume) {
    if (!canAnalyze || busy.current || importPending) return;
    busy.current = true;
    setStatus("ANALYZING");
    setError("");
    setResult(null);
    await new Promise((r) => setTimeout(r, 350));
    try {
      const next = analyze(job, resumeText);
      setResult(next);
      setEdited(resumeText);
      setAnalyzedResume(resumeText);
      setManuallyEdited(false);
      setAnalysisVersion((version) => version + 1);
      setStatus("SUCCESS");
      setTimeout(() => resultRef.current?.focus(), 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível concluir a análise. Tente novamente.",
      );
      setStatus("ERROR");
    } finally {
      busy.current = false;
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(edited);
      toast.success("Currículo copiado com sucesso.", { id: "feedback" });
    } catch {
      toast.error(
        "Não foi possível copiar. Selecione o texto do currículo e copie manualmente.",
      );
    }
  }
  async function download() {
    try {
      const { exportResumePdf } = await import("./lib/pdf");
      exportResumePdf(edited);
      toast.success("PDF exportado com sucesso.", { id: "feedback" });
    } catch {
      toast.error("Não foi possível exportar o PDF. Tente novamente.");
    }
  }
  const reset = () => {
    setResult(null);
    setEdited("");
    setStatus("READY");
    setError("");
    document.getElementById("job")?.focus();
  };
  return (
    <>
      <a className="skip" href="#analysis">
        Ir para a análise
      </a>
      <header>
        <div className="container header-inner">
          <a href="#" className="logo" aria-label="MatchCV início">
            <span className="logo-icon">
              <ScanLine size={23} />
            </span>
            Match<span>CV</span>
          </a>
          <div className="header-actions">
            <a className="nav-link" href="#how">
              Como funciona? <CircleHelp size={16} />
            </a>
            <Button
              variant="outline"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Modo escuro"
              aria-pressed={theme === "dark"}
              title={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
            >
              {theme === "dark" ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
              <span>Modo escuro</span>
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero container">
          <Badge className="eyebrow">
            <span className="dot" /> Seu próximo passo começa aqui
          </Badge>
          <h1>
            Seu currículo fala a<br />
            mesma <span>língua da vaga?</span>
          </h1>
          <p>
            Compare seu currículo com a descrição da oportunidade, descubra
            quais competências estão alinhadas e gere uma versão mais amigável
            para sistemas ATS.
          </p>
          <Button asChild>
            <a href="#analysis">
              Começar análise <ArrowRight size={18} />
            </a>
          </Button>
          <div className="hero-notes">
            <span>
              <Check size={15} /> Sem cadastro
            </span>
            <span>
              <Check size={15} /> Gratuito
            </span>
            <span>
              <LockKeyhole size={14} /> Seus dados ficam com você
            </span>
          </div>
        </section>
        <div className="container workspace">
          <div className="steps" aria-label="Etapas">
            <span className={!result ? "active" : ""}>
              <b>1</b> Adicione seus textos
            </span>
            <i />
            <span className={result ? "active" : ""}>
              <b>2</b> Descubra o match
            </span>
            <i />
            <span>
              <b>3</b> Prepare seu currículo
            </span>
          </div>
          <Alert>
            <ShieldCheck size={23} />
            <div>
              <strong>Sua experiência, apresentada da melhor forma.</strong>
              <p>
                O MatchCV melhora como você apresenta suas experiências, mas
                nunca inventa experiências, habilidades ou qualificações que
                você não informou.
              </p>
            </div>
          </Alert>
          <section id="analysis" aria-labelledby="input-title">
            <div className="section-heading">
              <div>
                <span className="overline">O PRIMEIRO PASSO</span>
                <h2 id="input-title">Vamos encontrar as conexões.</h2>
                <p>
                  Cole os dois textos abaixo. Nós ajudamos você a enxergar o que
                  combina.
                </p>
              </div>
              <Badge className="local">
                <LockKeyhole size={13} /> Análise privada e local
              </Badge>
            </div>
            <div className="example-row">
              <Button
                variant="outline"
                disabled={Boolean(job || resume) || importPending}
                onClick={() => {
                  setJob(exampleJob);
                  setResume(exampleResume);
                  setStatus("READY");
                }}
              >
                Usar exemplo fictício
              </Button>
              <p>
                Experimente com dados fictícios. Disponível quando os dois
                campos estão vazios.
              </p>
            </div>
            <div className="input-grid">
              {[
                {
                  kind: "job" as const,
                  title: "Descrição da vaga",
                  icon: BriefcaseBusiness,
                  value: job,
                  placeholder: "Cole aqui a descrição completa da vaga...",
                  help: "Inclua os requisitos, as responsabilidades e os diferenciais da oportunidade.",
                },
                {
                  kind: "resume" as const,
                  title: "Seu currículo",
                  icon: FileText,
                  value: resume,
                  placeholder: "Cole aqui o conteúdo do seu currículo...",
                  help: "Evite inserir CPF, RG, endereço residencial completo ou outros documentos pessoais desnecessários.",
                },
              ].map(
                (
                  { kind, title, icon: Icon, value, placeholder, help },
                  index,
                ) => (
                  <Card key={kind} className="input-card">
                    <div className="card-title">
                      <span className="field-icon">
                        <Icon size={20} />
                      </span>
                      <div>
                        <label htmlFor={kind}>{title}</label>
                        <span>
                          {index === 0
                            ? "A oportunidade que você quer"
                            : "A experiência que você tem"}
                        </span>
                      </div>
                      <span className="number">0{index + 1}</span>
                    </div>
                    {kind === "resume" && (
                      <ResumeImport
                        disabled={status === "ANALYZING"}
                        hasResume={Boolean(resume.trim())}
                        onApply={(text) => change(text, "resume")}
                        onPendingChange={setImportPending}
                      />
                    )}
                    <Textarea
                      id={kind}
                      value={value}
                      disabled={status === "ANALYZING"}
                      onChange={(e) => change(e.target.value, kind)}
                      placeholder={placeholder}
                      maxLength={30000}
                      aria-describedby={`${kind}-help ${kind}-count ${kind}-validation`}
                    />
                    <div className="field-footer">
                      <span>Somente texto</span>
                      <span id={`${kind}-count`}>
                        {value.length.toLocaleString("pt-BR")} / 30.000
                        caracteres
                      </span>
                    </div>
                    <p className="field-help" id={`${kind}-help`}>
                      {help}
                    </p>
                    <p className="validation" id={`${kind}-validation`}>
                      {value.length > 0 && value.trim().length < 30
                        ? kind === "job"
                          ? "Adicione uma descrição de vaga mais completa para obter uma análise melhor."
                          : "Adicione mais informações do seu currículo para realizar a comparação."
                        : ""}
                    </p>
                  </Card>
                ),
              )}
            </div>
            <div className="analyze-row">
              <p>
                <LockKeyhole size={15} /> Os textos são processados no seu
                navegador.
                <br />
                <span>Nenhum currículo é armazenado ou enviado.</span>
              </p>
              <Button
                disabled={
                  !canAnalyze || status === "ANALYZING" || importPending
                }
                onClick={() => void handleAnalyze()}
              >
                {status === "ANALYZING" ? (
                  <LoaderCircle className="spin" size={19} />
                ) : (
                  <Sparkles size={19} />
                )}{" "}
                {status === "ANALYZING"
                  ? "Analisando compatibilidade..."
                  : "Analisar currículo"}
                {status !== "ANALYZING" && <ArrowRight size={18} />}
              </Button>
            </div>
            <p className="minimum">Mínimo de 30 caracteres em cada campo.</p>
            <div aria-live="polite">
              {status === "ANALYZING" && (
                <div className="loading">
                  <p>Analisando compatibilidade...</p>
                  <Skeleton />
                  <Skeleton />
                </div>
              )}
            </div>
            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
          </section>
          {result && (
            <section
              ref={resultRef}
              tabIndex={-1}
              className="results"
              aria-labelledby="result-title"
            >
              <div className="section-heading">
                <div>
                  <span className="overline">CONEXÕES ENCONTRADAS</span>
                  <h2 id="result-title">Resultado da análise</h2>
                </div>
                <Badge>
                  <CheckCircle2 size={14} /> Análise concluída
                </Badge>
              </div>
              <div className="result-grid">
                <Card className="score">
                  <h3>Match estimado</h3>
                  <strong>
                    {result.matchScore}
                    <small>%</small>
                  </strong>
                  <Progress value={result.matchScore} />
                  <p>
                    Encontrado = 1; parcial = 0,5; ausente = 0. Obrigatórios têm
                    peso 2; desejáveis e não especificados têm peso 1.
                  </p>
                </Card>
                {(["FOUND", "PARTIAL", "NOT_FOUND"] as const).map((type) => {
                  const Icon = icons[type];
                  const items =
                    type === "FOUND"
                      ? result.keywordsFound
                      : type === "PARTIAL"
                        ? result.keywordsPartial
                        : result.keywordsMissing;
                  return (
                    <Card key={type} className={`keyword-card ${type}`}>
                      <Icon size={21} />
                      <h3>
                        {type === "FOUND"
                          ? "Palavras encontradas"
                          : type === "PARTIAL"
                            ? "Correspondências parciais"
                            : "Palavras não encontradas"}
                      </h3>
                      <div className="badges">
                        {items.length ? (
                          items.map((k) => <Badge key={k}>{k}</Badge>)
                        ) : (
                          <p>Nenhuma nesta análise.</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
              <p className="disclaimer">
                O percentual apresentado é uma estimativa de compatibilidade
                entre seu currículo e a vaga. Ele não representa a pontuação de
                um ATS específico. A comparação local usa palavras-chave e
                frases; não avalia todo o contexto, senioridade ou equivalência
                de qualificações.
              </p>
              <Alert>
                <CircleHelp size={22} />
                <p>
                  As competências não encontradas aparecem na vaga, mas não
                  foram identificadas no currículo. Não as adicione a menos que
                  você realmente possua experiência com elas.
                </p>
              </Alert>
              <Card className="review-card" id="requirement-priorities">
                <h2>O que a vaga prioriza</h2>
                <p className="disclaimer">
                  Classificação por expressões explícitas e títulos da vaga. Sem
                  indicação clara, usamos “Não especificado”. Confira a
                  descrição original: esta leitura é uma heurística, não uma
                  decisão do recrutador.
                </p>
                <div className="priority-grid">
                  {(
                    [
                      "REQUIRED",
                      "DESIRED",
                      "UNSPECIFIED",
                    ] as RequirementPriority[]
                  ).map((priority) => {
                    const items = result.requirements.filter(
                      (r) => r.priority === priority,
                    );
                    return (
                      <section key={priority}>
                        <h3>
                          {priorityLabels[priority]} · {items.length}
                        </h3>
                        {items.length ? (
                          <ul>
                            {items.map((r) => {
                              const Icon = icons[r.status];
                              return (
                                <li key={r.requirement}>
                                  <Icon size={16} />
                                  <span>
                                    {r.requirement}
                                    <small>{labels[r.status]}</small>
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p>Nenhum requisito nesta categoria.</p>
                        )}
                      </section>
                    );
                  })}
                </div>
              </Card>
              <Card className="evidence">
                <h3>
                  <ListChecks size={21} /> Como chegamos a essa análise?
                </h3>
                {result.requirements.map((r) => {
                  const Icon = icons[r.status];
                  return (
                    <div className="evidence-row" key={r.requirement}>
                      <div>
                        <strong>{r.requirement}</strong>
                        <Badge>{priorityLabels[r.priority]}</Badge>
                        <Badge className={r.status}>
                          <Icon size={14} />
                          {labels[r.status]}
                        </Badge>
                      </div>
                      <p>
                        {r.evidence
                          ? `“${r.evidence}”`
                          : "Nenhuma evidência encontrada no currículo."}
                      </p>
                    </div>
                  );
                })}
              </Card>
              <Card className="suggestions">
                <h3>
                  <Sparkles size={21} /> Como melhorar seu currículo para esta
                  vaga
                </h3>
                <ul>
                  {result.suggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Card>
              <ExperienceQuestions
                key={`questions-${analysisVersion}`}
                missing={result.keywordsMissing}
                original={analyzedResume}
                disabled={importPending}
                onApply={(text) => {
                  setResume(text);
                  void handleAnalyze(text);
                }}
              />
              <ResumeReview
                key={`review-${analysisVersion}`}
                original={analyzedResume}
                current={edited}
                manuallyEdited={manuallyEdited}
                onChange={setEdited}
              />
              <Card className="editor">
                <div className="section-heading">
                  <div>
                    <h2>
                      <PencilLine size={23} /> Currículo otimizado
                    </h2>
                    <p>Formato simples. Sua experiência continua sendo sua.</p>
                  </div>
                  <Badge>
                    <ShieldCheck size={14} />{" "}
                    {manuallyEdited
                      ? "Edição manual: revise os fatos"
                      : "Alterações automáticas validadas"}
                  </Badge>
                </div>
                <p className="disclaimer">
                  Aceite as sugestões de títulos e espaçamento na comparação
                  acima ou edite o texto abaixo. Alterações manuais são de sua
                  responsabilidade e bloqueiam as sugestões anteriores para
                  evitar sobrescrever sua edição.
                </p>
                <label htmlFor="optimized">Revise e edite seu currículo</label>
                <Textarea
                  id="optimized"
                  value={edited}
                  maxLength={30000}
                  onChange={(e) => {
                    setEdited(e.target.value);
                    setManuallyEdited(true);
                  }}
                />
                <div className="editor-actions">
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw size={17} />
                    Nova análise
                  </Button>
                  <div>
                    <Button
                      variant="outline"
                      onClick={copy}
                      disabled={!edited.trim()}
                    >
                      <Copy size={17} />
                      Copiar currículo
                    </Button>
                    <Button onClick={download} disabled={!edited.trim()}>
                      <Download size={17} />
                      Exportar PDF
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          )}
          <section id="how" className="how">
            <span className="overline">SIMPLES DO INÍCIO AO FIM</span>
            <h2>Mais clareza para o seu próximo passo.</h2>
            <div className="how-grid">
              {[
                {
                  Icon: FileText,
                  title: "1. Cole a vaga e o currículo",
                  text: "Reúna a descrição da oportunidade e o texto do seu currículo. Você também pode importar seu currículo em PDF ou DOCX.",
                },
                {
                  Icon: ScanLine,
                  title: "2. Entenda a compatibilidade",
                  text: "Veja competências alinhadas, pontos de atenção e as evidências por trás de cada resultado.",
                },
                {
                  Icon: Download,
                  title: "3. Leve uma versão mais clara",
                  text: "Revise, edite e exporte seu currículo em um PDF simples, legível e amigável para sistemas ATS.",
                },
              ].map(({ Icon, title, text }) => (
                <div key={title}>
                  <span className="how-icon">
                    <Icon size={23} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <p className="closing">
              <ShieldCheck size={17} /> Reescrever é permitido. Inventar não.
            </p>
          </section>
        </div>
      </main>
      <footer className="container">
        <a className="logo" href="#">
          Match<span>CV</span>
        </a>
        <p>Seu potencial merece ser bem apresentado.</p>
        <span>
          Feito para o seu próximo passo <ArrowDown size={14} />
        </span>
      </footer>
      <Toaster theme={theme} position="bottom-right" duration={10000} />
    </>
  );
}
