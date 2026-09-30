import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { Button } from "./ui/button";
import { Card, Textarea } from "./ui/primitives";
import { appendConfirmedExperience } from "../lib/supplement";
export function ExperienceQuestions({
  missing,
  original,
  disabled,
  onApply,
}: {
  missing: string[];
  original: string;
  disabled: boolean;
  onApply: (text: string) => void;
}) {
  const [selected, setSelected] = useState(missing[0] ?? "");
  const [answer, setAnswer] = useState("");
  const [details, setDetails] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  if (!missing.length) return null;
  function apply() {
    try {
      onApply(appendConfirmedExperience(original, details, confirmed));
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível adicionar o relato.",
      );
    }
  }
  return (
    <Card className="review-card" id="experience-questions">
      <h2>
        <MessageCircleQuestion size={23} /> Faltou contar alguma experiência?
      </h2>
      <p className="disclaimer">
        Ausência no texto não significa ausência de experiência. Responda
        somente com fatos que você pode confirmar.
      </p>
      <label htmlFor="missing-requirement">Requisito a esclarecer</label>
      <select
        id="missing-requirement"
        value={selected}
        disabled={disabled}
        onChange={(e) => {
          setSelected(e.target.value);
          setAnswer("");
          setDetails("");
          setConfirmed(false);
          setError("");
        }}
      >
        {missing.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <fieldset disabled={disabled}>
        <legend>
          Você possui experiência ou qualificação que comprove “{selected}”?
        </legend>
        {[
          ["yes", "Sim, tenho experiência"],
          ["no", "Não possuo"],
          ["skip", "Prefiro não informar"],
        ].map(([value, label]) => (
          <label className="radio-label" key={value}>
            <input
              type="radio"
              name="experience-answer"
              value={value}
              checked={answer === value}
              onChange={() => {
                setAnswer(value);
                setConfirmed(false);
                setError("");
              }}
            />
            {label}
          </label>
        ))}
      </fieldset>
      {(answer === "no" || answer === "skip") && (
        <p className="disclaimer" role="status">
          Nenhuma informação será adicionada. O requisito permanece sem
          evidência nesta análise.
        </p>
      )}
      {answer === "yes" && (
        <>
          <label htmlFor="experience-details">
            Conte o que você realmente fez
          </label>
          <Textarea
            id="experience-details"
            disabled={disabled}
            value={details}
            maxLength={3000}
            onChange={(e) => {
              setDetails(e.target.value);
              setConfirmed(false);
            }}
            placeholder="Descreva a atividade, o contexto e a competência usada. Não acrescente métricas ou tempo de experiência que você não possa confirmar."
            aria-describedby="experience-detail-help"
          />
          <p id="experience-detail-help" className="disclaimer">
            Mínimo de 30 caracteres. O relato será incluído exatamente como você
            escreveu; mencionar apenas “sim” não comprova o requisito. A nova
            análise substitui os resultados e a versão ajustada atuais.
          </p>
          <label className="radio-label">
            <input
              type="checkbox"
              checked={confirmed}
              disabled={disabled}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Confirmo que o relato é verdadeiro e autorizo sua inclusão no
            currículo.
          </label>
          <Button
            disabled={disabled || !confirmed || details.trim().length < 30}
            onClick={apply}
          >
            Adicionar relato e reanalisar
          </Button>
        </>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}
