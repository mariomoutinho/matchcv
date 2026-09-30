import { useMemo, useState } from "react";
import {
  Check,
  X,
  Columns2,
  ListChecks,
  CircleHelp,
  CheckCircle2,
} from "lucide-react";
import {
  createResumeEdits,
  applyResumeEdits,
  validateIntegrity,
} from "../lib/resume";
import { checkResume } from "../lib/checklist";
import { Button } from "./ui/button";
import { Card, Badge } from "./ui/primitives";
export function ResumeReview({
  original,
  current,
  manuallyEdited,
  onChange,
}: {
  original: string;
  current: string;
  manuallyEdited: boolean;
  onChange: (text: string) => void;
}) {
  const edits = useMemo(() => createResumeEdits(original), [original]);
  const [decisions, setDecisions] = useState<
    Record<number, "accepted" | "rejected">
  >({});
  function decide(id: number, decision: "accepted" | "rejected") {
    if (manuallyEdited) return;
    const next = { ...decisions, [id]: decision };
    const output = applyResumeEdits(
      original,
      edits
        .filter((edit) => next[edit.id] === "accepted")
        .map((edit) => edit.id),
    );
    if (!validateIntegrity(original, output)) return;
    setDecisions(next);
    onChange(output);
  }
  const checklist = checkResume(current);
  return (
    <>
      <Card className="review-card" id="comparison">
        <h2>
          <Columns2 size={23} /> Original e versão ajustada
        </h2>
        <p className="disclaimer">
          Aceite ou rejeite cada sugestão. Somente as alterações aceitas entram
          na versão ajustada. Nenhum fato é acrescentado.
        </p>
        <div className="comparison-grid">
          <div>
            <h3>Currículo original desta análise</h3>
            <pre
              tabIndex={0}
              role="region"
              aria-label="Texto do currículo original"
            >
              {original}
            </pre>
          </div>
          <div>
            <h3>Versão ajustada atual</h3>
            <pre
              tabIndex={0}
              role="region"
              aria-label="Texto da versão ajustada"
            >
              {current || "O currículo está vazio."}
            </pre>
          </div>
        </div>
        {manuallyEdited && (
          <p className="disclaimer" role="status">
            Você editou a versão ajustada manualmente. As decisões abaixo estão
            bloqueadas para preservar sua edição. Uma nova análise permite
            recomeçar a revisão.
          </p>
        )}
        {!edits.length && (
          <p className="disclaimer">
            Não há alterações automáticas de títulos ou espaços para propor.
            Você pode editar o currículo abaixo.
          </p>
        )}
        {edits.map((edit) => (
          <div
            className="change-row"
            key={edit.id}
            role="group"
            aria-label={`Alteração na linha ${edit.id + 1}`}
          >
            <div>
              <strong>{edit.reason}</strong>
              <p>
                Antes: <code>{edit.original || "(linha vazia)"}</code>
              </p>
              <p>
                Proposta: <code>{edit.proposed.trim() || "(sem espaços)"}</code>
              </p>
              <Badge>
                {decisions[edit.id] === "accepted"
                  ? "Aceita"
                  : decisions[edit.id] === "rejected"
                    ? "Rejeitada"
                    : "Pendente"}
              </Badge>
            </div>
            <div className="change-actions">
              <Button
                variant="outline"
                disabled={manuallyEdited}
                aria-pressed={decisions[edit.id] === "accepted"}
                onClick={() => decide(edit.id, "accepted")}
              >
                <Check size={16} />
                Aceitar
              </Button>
              <Button
                variant="outline"
                disabled={manuallyEdited}
                aria-pressed={decisions[edit.id] === "rejected"}
                onClick={() => decide(edit.id, "rejected")}
              >
                <X size={16} />
                Rejeitar
              </Button>
            </div>
          </div>
        ))}
      </Card>
      <Card className="review-card" id="ats-checklist">
        <h2>
          <ListChecks size={23} /> Checklist de formatação para ATS
        </h2>
        <p className="disclaimer">
          Verificação local do texto da versão ajustada, atualizada durante a
          edição. Não é uma certificação de compatibilidade.
        </p>
        <ul className="checklist">
          {checklist.map((item) => {
            const Icon = item.status === "PASS" ? CheckCircle2 : CircleHelp;
            return (
              <li key={item.id}>
                <Icon size={20} aria-hidden="true" />
                <div>
                  <strong>{item.label}</strong>
                  <Badge>
                    {item.status === "PASS"
                      ? "Verificado"
                      : item.status === "ATTENTION"
                        ? "Revisar"
                        : "Conferir manualmente"}
                  </Badge>
                  <p>{item.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
