export const RESUME_MODIFIER_STORAGE_KEY = "pm_resume_modifier_pass_v1";
export const RESUME_MODIFIER_DIGEST = "4b61de236fb88a5dbe7138a955701e8065b0f4c27a91b58aeb611ed242187ebc";
export const RESUME_MODIFIER_WEBHOOK = "https://n8n.srv1182241.hstgr.cloud/webhook/pm-resume-modifier";
export const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const MAX_RESUME_BYTES = 10 * 1024 * 1024;

export type JobInputType = "paste" | "screenshot" | "url";

export async function sha256Hex(val: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(val.trim()));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function matchesResumeModifierPassword(val: string | null | undefined) {
  if (!val || !val.trim()) return false;
  return (await sha256Hex(val)) === RESUME_MODIFIER_DIGEST;
}

export function validateSubmission(i: {
  resumeFile: boolean; resumeText: string; jobInputType: JobInputType;
  jobText: string; jobScreenshotDataUrl: string; jobUrl: string;
}): string | null {
  if (!i.resumeFile && i.resumeText.trim().length < 20) return "Please upload your base resume or paste at least 20 characters of resume text.";
  if (i.jobInputType === "paste" && !i.jobText.trim()) return "Please paste the target job description.";
  if (i.jobInputType === "screenshot" && !i.jobScreenshotDataUrl) return "Please upload a screenshot of the job posting.";
  if (i.jobInputType === "url" && !i.jobUrl.trim().startsWith("http")) return "Please enter a valid job URL starting with http.";
  return null;
}

export function unescapeXml(s: string) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

export function docXmlToText(xml: string) {
  return unescapeXml(xml.replace(/<w:tab\/>/g, "\t").replace(/<\/w:p>/g, "\n").replace(/<[^>]+>/g, ""))
    .replace(/\n{3,}/g, "\n\n").trim();
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function extractDocxText(buf: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buf);
  const dv = new DataView(buf);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("Not a valid .docx (no EOCD)");
  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  for (let n = 0; n < count; n++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOff = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (name === "word/document.xml") {
      const lNameLen = dv.getUint16(localOff + 26, true);
      const lExtraLen = dv.getUint16(localOff + 28, true);
      const start = localOff + 30 + lNameLen + lExtraLen;
      const raw = bytes.subarray(start, start + compSize);
      let data: Uint8Array;
      if (method === 0) data = raw;
      else if (method === 8) data = await inflateRaw(raw);
      else throw new Error("Unsupported compression");
      return docXmlToText(new TextDecoder().decode(data));
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("word/document.xml not found");
}

/** Best-effort: pulls text from (Tj/TJ) operators in uncompressed or Flate streams. */
export async function extractPdfText(buf: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buf);
  const latin = new TextDecoder("latin1").decode(bytes);
  const chunks: string[] = [];
  const re = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(latin))) {
    const start = m.index + m[0].length;
    const end = latin.indexOf("endstream", start);
    if (end < 0) break;
    const head = latin.slice(Math.max(0, m.index - 300), m.index);
    let content = latin.slice(start, end);
    if (/FlateDecode/.test(head)) {
      try {
        const s = new Blob([bytes.subarray(start, end)]).stream().pipeThrough(new DecompressionStream("deflate"));
        content = new TextDecoder("latin1").decode(await new Response(s).arrayBuffer());
      } catch { continue; }
    }
    const parts = content.match(/\((?:\\.|[^\\)])*\)\s*Tj|\[(?:[^\]]*)\]\s*TJ|T\*|ET/g) || [];
    for (const part of parts) {
      if (part === "ET" || part === "T*") { chunks.push("\n"); continue; }
      const strs = part.match(/\((?:\\.|[^\\)])*\)/g) || [];
      chunks.push(strs.map((x) => x.slice(1, -1).replace(/\\([()\\])/g, "$1").replace(/\\n/g, "\n")).join(""));
    }
    re.lastIndex = end;
  }
  const text = chunks.join("").replace(/[^\x09\x0a\x20-\x7e]/g, "").replace(/\n{3,}/g, "\n\n").trim();
  return text.length >= 40 ? text : "";
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] || "");
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}

export function base64ToBlob(b64: string, mime = DOCX_MIME) {
  const bin = atob(b64.replace(/^data:[^,]+,/, ""));
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
