import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, Image as ImageIcon, Link2, Loader2, Lock, Unlock } from "lucide-react";
import {
  RESUME_MODIFIER_STORAGE_KEY, RESUME_MODIFIER_WEBHOOK, MAX_RESUME_BYTES, type JobInputType,
  matchesResumeModifierPassword, validateSubmission, extractDocxText, extractPdfText,
  fileToBase64, fileToDataUrl, base64ToBlob, downloadBlob,
} from "@/lib/resumeModifier";

type MatchedJob = { title?: string; company?: string; score?: number | string; url?: string } | string;
type ExperienceItem = { title?: string; company?: string; dates?: string; bullets?: string[] } | string;
type ResultData = {
  status?: string; docxBase64?: string; fileName?: string;
  targetJobTitle?: string; jobTitle?: string; targetCompany?: string; company?: string;
  matchSummary?: string; matchedJobs?: MatchedJob[];
  rewrittenResume?: { summary?: string; experience?: ExperienceItem[]; skills?: string[] | string };
  message?: string;
};

const labelCls = "block text-white text-base font-medium mb-1.5";
const fieldCls = "bg-black/30 border-white/15 text-white";
const PDF_FALLBACK = "We couldn't extract readable text from this PDF. Please paste your resume text here (the original PDF is still sent).";

const ResumeModifierPage = () => {
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState<string | null>(null);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [baseResumeBase64, setBaseResumeBase64] = useState("");
  const [baseResumeText, setBaseResumeText] = useState("");
  const [showText, setShowText] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const [jobInputType, setJobInputType] = useState<JobInputType>("paste");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobNotes, setJobNotes] = useState("");
  const [jobScreenshotDataUrl, setJobScreenshotDataUrl] = useState("");
  const [jobScreenshotFileName, setJobScreenshotFileName] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [docxName, setDocxName] = useState("Tailored-PM-Resume.docx");

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PM Consultant Resume Modifier | Zero to PM Consultant";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prev = meta?.getAttribute("content") ?? null;
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "robots"); document.head.appendChild(meta); }
    meta.setAttribute("content", "noindex, nofollow");
    return () => { document.title = prevTitle; if (prev === null) meta?.remove(); else meta?.setAttribute("content", prev); };
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(RESUME_MODIFIER_STORAGE_KEY);
    matchesResumeModifierPassword(stored).then((ok) => {
      if (ok && stored) setPassword(stored.trim());
      else if (stored) sessionStorage.removeItem(RESUME_MODIFIER_STORAGE_KEY);
      setChecking(false);
    });
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passInput.trim();
    if (await matchesResumeModifierPassword(trimmed)) {
      sessionStorage.setItem(RESUME_MODIFIER_STORAGE_KEY, trimmed);
      setPassword(trimmed); setPassError(""); setPassInput("");
    } else setPassError("Invalid password. Please try again.");
  };

  const handleLock = () => { sessionStorage.removeItem(RESUME_MODIFIER_STORAGE_KEY); setPassword(null); setResult(null); setDocxBlob(null); };

  const handleResumeFile = async (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (file.size > MAX_RESUME_BYTES) { setError("Resume file must be 10MB or smaller."); return; }
    if (!/\.(docx|pdf|txt|md)$/i.test(file.name)) { setError("Please upload a .docx, .pdf, .txt or .md file."); return; }
    setResumeFile(file); setExtracting(true);
    try {
      setBaseResumeBase64(await fileToBase64(file));
      const name = file.name.toLowerCase();
      let text = "";
      if (name.endsWith(".docx")) text = await extractDocxText(await file.arrayBuffer());
      else if (name.endsWith(".txt") || name.endsWith(".md")) text = await file.text();
      else if (name.endsWith(".pdf")) { text = await extractPdfText(await file.arrayBuffer()); if (!text) { setShowText(true); setBaseResumeText(""); setError(PDF_FALLBACK); return; } }
      setBaseResumeText(text); setShowText(true);
    } catch {
      setShowText(true); setBaseResumeText("");
      setError("We couldn't read text from this file. Please paste your resume text below (the file is still sent).");
    } finally { setExtracting(false); }
  };

  const handleScreenshot = async (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { setError("Please upload a PNG, JPEG or WebP image."); return; }
    setJobScreenshotDataUrl(await fileToDataUrl(file)); setJobScreenshotFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const v = validateSubmission({ resumeFile: !!resumeFile, resumeText: baseResumeText, jobInputType, jobText, jobScreenshotDataUrl, jobUrl });
    if (v) { setError(v); return; }
    const notes = jobNotes.trim();
    const body = {
      password, clientName: clientName.trim(), clientEmail: clientEmail.trim(),
      baseResumeFileName: resumeFile?.name || "", baseResumeText, baseResumeBase64,
      jobInputType,
      jobText: jobInputType === "paste" ? jobText : notes,
      jobUrl: jobInputType === "url" ? jobUrl.trim() : "",
      jobScreenshotDataUrl: jobInputType === "screenshot" ? jobScreenshotDataUrl : "",
      jobScreenshotFileName: jobInputType === "screenshot" ? jobScreenshotFileName : "",
    };
    setSubmitting(true); setResult(null); setDocxBlob(null);
    try {
      const res = await fetch(RESUME_MODIFIER_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const raw = await res.json().catch(() => null);
      const data: ResultData | null = Array.isArray(raw) ? raw[0] : raw;
      if (!res.ok || !data || data.status !== "success" || !data.docxBase64) {
        throw new Error(data?.message || `The resume service returned an error (${res.status}).`);
      }
      const blob = base64ToBlob(data.docxBase64);
      const name = data.fileName || "Tailored-PM-Resume.docx";
      setDocxBlob(blob); setDocxName(name); setResult(data);
      downloadBlob(blob, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  const tabs: { id: JobInputType; label: string; Icon: typeof FileText }[] = [
    { id: "paste", label: "Paste Job Text", Icon: FileText },
    { id: "screenshot", label: "Upload Screenshot", Icon: ImageIcon },
    { id: "url", label: "Enter Job URL", Icon: Link2 },
  ];

  const skills = result?.rewrittenResume?.skills;
  const skillList = Array.isArray(skills) ? skills : skills ? String(skills).split(/,\s*/) : [];

  return (
    <div className="min-h-screen">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {checking ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#FFE361]" /></div>
          ) : !password ? (
            <form onSubmit={handleUnlock} className="volumetric-glass rounded-2xl p-6 md:p-8 max-w-md mx-auto text-center space-y-4">
              <Lock className="w-10 h-10 mx-auto text-[#FFE361]" />
              <h1 className="text-2xl md:text-3xl font-bold text-[#FFE361]">PM Consultant Resume Modifier — Protected Access</h1>
              <p className="text-white/80 text-sm">Enter the access password to use this tool.</p>
              <Input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="Password" className={fieldCls} autoFocus aria-label="Password" />
              {passError && <p className="text-sm text-destructive">{passError}</p>}
              <Button type="submit" className="w-full bg-[#FFE361] text-black hover:bg-[#FFE361]/90 font-bold">Unlock Tool</Button>
            </form>
          ) : (
            <>
              <div className="volumetric-glass rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#FFE361]">
                      PM Consultant Resume Modifier
                    </h1>
                    <p className="text-white/80 mt-2">
                      Upload your base resume, tell us the target job, and get a tailored Word (.docx) resume.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLock}
                    className="self-start sm:self-center shrink-0 border-white/25 bg-black/40 hover:bg-white/10 text-white px-4 py-2"
                  >
                    <Lock className="w-4 h-4 mr-1.5" /> Lock Page
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="volumetric-glass rounded-2xl p-6 md:p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls} htmlFor="rm-name">Your Name</label>
                    <Input id="rm-name" value={clientName} onChange={(e) => setClientName(e.target.value)} className={fieldCls} /></div>
                  <div><label className={labelCls} htmlFor="rm-email">Your Email</label>
                    <Input id="rm-email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className={fieldCls} /></div>
                </div>

                <div>
                  <label className={labelCls} htmlFor="rm-resume">1. Upload Your Base Resume (Required)</label>
                  <Input id="rm-resume" type="file" accept=".docx,.pdf,.txt,.md" onChange={(e) => handleResumeFile(e.target.files?.[0])} className={`${fieldCls} file:text-[#FFE361]`} />
                  <p className="text-muted-foreground text-sm mt-1">.docx, .pdf, .txt or .md — up to 10MB.</p>
                  {extracting && <p className="text-sm text-white/70 mt-2 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Extracting text…</p>}
                  <button type="button" onClick={() => setShowText((s) => !s)} className="text-sm text-[#06b6d4] underline mt-2">
                    {showText ? "Hide" : "Show"} Base Resume Text (Extracted / Editable)
                  </button>
                  {showText && (
                    <Textarea value={baseResumeText} onChange={(e) => setBaseResumeText(e.target.value)} rows={10}
                      placeholder="Your resume text appears here — or paste it directly." className={`${fieldCls} mt-2`} aria-label="Base Resume Text (Extracted / Editable)" />
                  )}
                </div>

                <div>
                  <span className={labelCls}>2. What job is this? (Required)</span>
                  <div className="grid grid-cols-3 gap-2 mb-3" role="tablist">
                    {tabs.map(({ id, label, Icon }) => (
                      <button key={id} type="button" role="tab" aria-selected={jobInputType === id} onClick={() => setJobInputType(id)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs sm:text-sm font-semibold border transition-colors ${jobInputType === id ? "bg-[#FFE361] text-black border-[#FFE361]" : "bg-black/30 text-white border-white/15"}`}>
                        <Icon className="w-4 h-4 shrink-0" /> {label}
                      </button>
                    ))}
                  </div>
                  {jobInputType === "paste" && (
                    <Textarea value={jobText} onChange={(e) => setJobText(e.target.value)} rows={8} placeholder="Paste the target PM job description…" className={fieldCls} aria-label="Job description" />
                  )}
                  {jobInputType === "screenshot" && (
                    <div className="space-y-3">
                      <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleScreenshot(e.target.files?.[0])} className={fieldCls} aria-label="Job screenshot" />
                      {jobScreenshotDataUrl && <img src={jobScreenshotDataUrl} alt="Job posting preview" className="max-h-80 rounded-xl border border-white/15 mx-auto" />}
                      <Input value={jobNotes} onChange={(e) => setJobNotes(e.target.value)} placeholder="Optional notes" className={fieldCls} />
                    </div>
                  )}
                  {jobInputType === "url" && (
                    <div className="space-y-3">
                      <Input type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." className={fieldCls} aria-label="Job URL" />
                      <Input value={jobNotes} onChange={(e) => setJobNotes(e.target.value)} placeholder="Optional notes" className={fieldCls} />
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" disabled={submitting || extracting} className="w-full bg-[#FFE361] text-black hover:bg-[#FFE361]/90 font-bold h-12">
                  {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Working…</> : "Generate Tailored Resume"}
                </Button>
                {submitting && (
                  <p className="text-sm text-white/80 text-center">Grok is matching the Google Drive Job Database &amp; rewriting your resume into a tailored Word .docx (approx. 20–40s)...</p>
                )}
              </form>

              {result && docxBlob && (
                <div className="volumetric-glass rounded-2xl p-6 md:p-8 space-y-5 border-2 border-[#FFE361]/60">
                  <h2 className="text-2xl font-bold text-[#FFE361]">Your Tailored Resume Is Ready</h2>
                  <Button type="button" onClick={() => downloadBlob(docxBlob, docxName)}
                    className="w-full h-12 font-bold text-black bg-gradient-to-r from-red-500 to-[#FFE361] hover:opacity-90">
                    <Download className="w-5 h-5 mr-2" /> Download Word (.docx) Resume
                  </Button>
                  <div className="grid sm:grid-cols-2 gap-3 text-white">
                    <div><span className="text-white/60 text-sm">Target Job</span><p className="font-semibold">{result.targetJobTitle || result.jobTitle || "—"}</p></div>
                    <div><span className="text-white/60 text-sm">Company</span><p className="font-semibold">{result.targetCompany || result.company || "—"}</p></div>
                  </div>
                  {result.matchSummary && <div><h3 className="text-lg font-bold text-[#FFE361]">Tailoring Summary</h3><p className="text-white/90 whitespace-pre-line">{result.matchSummary}</p></div>}
                  {!!result.matchedJobs?.length && (
                    <div><h3 className="text-lg font-bold text-[#FFE361]">Matched Google Drive Database Jobs</h3>
                      <ul className="list-disc pl-5 text-white/90 space-y-1">
                        {result.matchedJobs.map((j, i) => (
                          <li key={i}>{typeof j === "string" ? j : <>{j.title}{j.company ? ` — ${j.company}` : ""}{j.score != null ? ` (${j.score})` : ""}</>}</li>
                        ))}
                      </ul></div>
                  )}
                  {result.rewrittenResume && (
                    <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-4">
                      <h3 className="text-lg font-bold text-[#FFE361]">Rewritten Resume Preview</h3>
                      {result.rewrittenResume.summary && <p className="text-white/90 whitespace-pre-line">{result.rewrittenResume.summary}</p>}
                      {!!result.rewrittenResume.experience?.length && (
                        <div className="space-y-3">
                          {result.rewrittenResume.experience.map((x, i) => typeof x === "string" ? <p key={i} className="text-white/90">{x}</p> : (
                            <div key={i}>
                              <p className="font-semibold text-white">{[x.title, x.company].filter(Boolean).join(" — ")}{x.dates ? <span className="text-white/60 font-normal"> · {x.dates}</span> : null}</p>
                              {!!x.bullets?.length && <ul className="list-disc pl-5 text-white/85 text-sm space-y-0.5">{x.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>}
                            </div>
                          ))}
                        </div>
                      )}
                      {!!skillList.length && (
                        <div className="flex flex-wrap gap-2">{skillList.map((s, i) => <span key={i} className="text-xs px-2 py-1 rounded-[6px] bg-[#06b6d4]/15 text-white border border-[#06b6d4]/40">{s}</span>)}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeModifierPage;
