import { extractRawText } from "mammoth";
self.onmessage = async ({ data }: MessageEvent<ArrayBuffer>) => {
  try {
    const result = await extractRawText({ arrayBuffer: data });
    self.postMessage({ text: result.value });
  } catch {
    self.postMessage({
      error:
        "Não foi possível ler este DOCX. Ele pode estar danificado ou protegido. Tente outro arquivo ou cole o texto.",
    });
  }
};
