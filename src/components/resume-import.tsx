import { useEffect, useRef, useState } from "react";
import { Upload, LoaderCircle, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/primitives";

interface ResumeImportProps {
  disabled: boolean;
  hasResume: boolean;
  onApply: (text: string) => void;
  onPendingChange: (pending: boolean) => void;
}

export function ResumeImport({
  disabled,
  hasResume,
  onApply,
  onPendingChange,
}: ResumeImportProps) {
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");

  const reviewing = draft !== null;
  useEffect(() => {
    if (reviewing) document.getElementById("import-review-text")?.focus();
  }, [reviewing]);

  async function select(file?: File) {
    if (!file || locked.current || disabled) return;
    locked.current = true;
    setLoading(true);
    setError("");
    onPendingChange(true);
    try {
      const { extractResume } = await import("../lib/resume-import");
      const text = await extractResume(file);
      setDraft(text);
      setFilename(file.name);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível importar o arquivo. Tente novamente ou cole o texto.",
      );
      onPendingChange(false);
    } finally {
      setLoading(false);
      locked.current = false;
      if (input.current) input.current.value = "";
    }
  }
  function finish(apply: boolean) {
    if (apply && draft?.trim()) onApply(draft.trim());
    setDraft(null);
    onPendingChange(false);
    window.setTimeout(
      () =>
        apply
          ? document.getElementById("resume")?.focus()
          : trigger.current?.querySelector("button")?.focus(),
      0,
    );
  }
  return (
    <div className="resume-import">
      <div ref={trigger}>
        <input
          ref={input}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-label="Selecionar arquivo do currículo"
          hidden
          onChange={(e) => void select(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || loading || draft !== null}
          onClick={() => input.current?.click()}
          aria-describedby="import-help"
        >
          {loading ? (
            <LoaderCircle size={17} className="spin" aria-hidden="true" />
          ) : (
            <Upload size={17} aria-hidden="true" />
          )}
          {loading ? "Extraindo texto..." : "Importar PDF ou DOCX"}
        </Button>
      </div>
      <p id="import-help" className="import-help">
        Até 5 MB · PDF com texto ou DOCX. Leitura privada no navegador.
      </p>
      <div role="status">
        {loading && (
          <p className="import-help">
            Lendo o arquivo. Seu texto atual será preservado até você confirmar.
          </p>
        )}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {draft !== null && (
        <div className="import-review">
          <h3>Revise o texto extraído</h3>
          <p className="import-help import-filename">{filename}</p>
          <p className="import-help">
            Confira nomes, datas e a ordem das informações, especialmente em
            documentos com colunas. Imagens não são transcritas.
          </p>
          <label htmlFor="import-review-text">Texto extraído do arquivo</label>
          <Textarea
            id="import-review-text"
            value={draft}
            maxLength={30000}
            onChange={(e) => setDraft(e.target.value)}
            aria-describedby="import-review-count"
          />
          <p id="import-review-count" className="import-help">
            {draft.length.toLocaleString("pt-BR")} / 30.000 caracteres
          </p>
          {hasResume && (
            <p className="import-help">
              Ao usar este texto, você substituirá o currículo preenchido
              abaixo.
            </p>
          )}
          <div className="import-actions">
            <Button disabled={!draft.trim()} onClick={() => finish(true)}>
              <Check size={16} />
              Usar texto revisado
            </Button>
            <Button variant="outline" onClick={() => finish(false)}>
              <X size={16} />
              Cancelar importação
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
