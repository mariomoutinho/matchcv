export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_RESUME_CHARACTERS = 30000;
const MAX_PDF_PAGES = 30;

export function validateResumeFile(
  file: Pick<File, "name" | "size">,
): "pdf" | "docx" {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension !== "pdf" && extension !== "docx")
    throw new Error(
      "Escolha um arquivo PDF ou DOCX. Arquivos .doc não são aceitos.",
    );
  if (!file.size)
    throw new Error("O arquivo está vazio. Escolha outro currículo.");
  if (file.size > MAX_FILE_BYTES)
    throw new Error("O arquivo ultrapassa 5 MB. Escolha uma versão menor.");
  return extension;
}

export function validateExtractedText(text: string): string {
  const clean = text
    .replace(/\r\n?/g, "\n")
    .replace(/\u0000/g, "")
    .trim();
  if (!clean)
    throw new Error(
      "Não encontramos texto selecionável. Se o arquivo for uma imagem ou um PDF digitalizado, copie o texto usando OCR e cole no campo do currículo.",
    );
  if (clean.length > MAX_RESUME_CHARACTERS)
    throw new Error(
      "O texto extraído ultrapassa 30.000 caracteres. Reduza o documento ou cole apenas o conteúdo do currículo.",
    );
  return clean;
}

async function readPdf(data: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const { default: workerUrl } =
    await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const task = pdfjs.getDocument({
    data,
    useSystemFonts: true,
  });
  const timeout = window.setTimeout(() => {
    void task.destroy();
  }, 30000);
  try {
    const pdf = await task.promise;
    if (pdf.numPages > MAX_PDF_PAGES)
      throw new Error(
        "O PDF ultrapassa 30 páginas. Importe apenas as páginas do currículo.",
      );
    const pages: string[] = [];
    let length = 0;
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      let text = "",
        previousY: number | undefined;
      for (const item of content.items) {
        if (!("str" in item)) continue;
        const y = item.transform[5];
        if (
          previousY !== undefined &&
          Math.abs(previousY - y) > 3 &&
          !text.endsWith("\n")
        )
          text += "\n";
        text += item.str + (item.hasEOL ? "\n" : " ");
        previousY = y;
      }
      pages.push(text.trim());
      length += text.length;
      page.cleanup();
      if (length > MAX_RESUME_CHARACTERS)
        throw new Error(
          "O texto extraído ultrapassa 30.000 caracteres. Reduza o documento ou cole apenas o conteúdo do currículo.",
        );
    }
    return pages.join("\n\n");
  } catch (error) {
    if (error instanceof Error && error.name === "PasswordException")
      throw new Error(
        "Este PDF está protegido por senha. Importe uma cópia sem senha.",
      );
    if (error instanceof Error && error.message.startsWith("O ")) throw error;
    throw new Error(
      "Não foi possível ler este PDF. Ele pode estar danificado ou ser muito complexo. Tente outro arquivo ou cole o texto.",
    );
  } finally {
    window.clearTimeout(timeout);
    await task.destroy();
  }
}

function readDocx(data: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./docx.worker.ts", import.meta.url), {
      type: "module",
    });
    const finish = () => {
      window.clearTimeout(timeout);
      worker.terminate();
    };
    const timeout = window.setTimeout(() => {
      finish();
      reject(
        new Error(
          "A leitura do DOCX demorou demais. Tente um arquivo menor ou cole o texto.",
        ),
      );
    }, 30000);
    worker.onmessage = ({
      data,
    }: MessageEvent<{ text?: string; error?: string }>) => {
      finish();
      if (data.error) reject(new Error(data.error));
      else resolve(data.text ?? "");
    };
    worker.onerror = () => {
      finish();
      reject(
        new Error(
          "Não foi possível ler este DOCX. Tente outro arquivo ou cole o texto.",
        ),
      );
    };
    worker.postMessage(data, [data]);
  });
}

export async function extractResume(file: File): Promise<string> {
  const extension = validateResumeFile(file);
  const data = await file.arrayBuffer();
  return validateExtractedText(
    await (extension === "pdf" ? readPdf(data) : readDocx(data)),
  );
}
