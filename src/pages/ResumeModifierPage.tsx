import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Download, FilePlus2, FileText, Image as ImageIcon, Link2, Loader2, Lock, Trash2 } from "lucide-react";
import {
  RESUME_MODIFIER_STORAGE_KEY, RESUME_MODIFIER_WEBHOOK, MAX_RESUME_BYTES, type JobInputType,
  matchesResumeModifierPassword, validateSubmission, extractDocxText, extractPdfText,
  fileToBase64, fileToDataUrl, base64ToBlob, downloadBlob,
  validateScratchSubmission, type ScratchSubmission, type ScratchEmployer, type ScratchEducation,
} from "@/lib/resumeModifier";

type MatchedJob = { title?: string; company?: string; score?: number | string; url?: string } | string;
type ExperienceItem = { title?: string; company?: string; dates?: string; bullets?: string[] } | string;
type CredentialItem = { title?: string; name?: string; dateRange?: string; dates?: string } | string;
type ResumePreview = {
  summary?: string; experience?: ExperienceItem[]; skills?: string[] | string;
  certifications?: CredentialItem[] | string; education?: CredentialItem[] | string; accolades?: CredentialItem[] | string;
};
type ResultData = {
  status?: string; docxBase64?: string; fileName?: string; modelUsed?: string;
  targetJobTitle?: string; jobTitle?: string; targetCompany?: string; company?: string;
  matchSummary?: string; matchedJobs?: MatchedJob[];
  rewrittenResume?: ResumePreview;
  summary?: string; experience?: ExperienceItem[]; skills?: string[] | string;
  certifications?: CredentialItem[] | string; education?: CredentialItem[] | string; accolades?: CredentialItem[] | string;
  message?: string;
};

const labelCls = "block text-white text-base font-medium mb-1.5";
const fieldCls = "bg-black/30 border-white/15 text-white";
const PDF_FALLBACK = "We couldn't extract readable text from this PDF. Please paste your resume text here (the original PDF is still sent).";
const goldCls = "text-[hsl(var(--quiz-highlight))]";
const scratchLabelCls = "block text-[hsl(var(--article-body))] text-base font-medium mb-1.5";
const scratchFieldCls = "bg-background/60 border-border/20 text-[hsl(var(--article-body))]";
const choiceCls = "bg-[hsl(var(--quiz-highlight))] text-accent-foreground hover:text-accent-foreground hover:bg-[hsl(var(--quiz-highlight))] font-bold whitespace-normal";
const emptyEmployer = (): ScratchEmployer => ({ startDate: "", endDate: "", companyName: "", position: "" });
const emptyEducation = (): ScratchEducation => ({ title: "", dateRange: "" });
const credentialLabels = (items?: CredentialItem[] | string): string[] => typeof items === "string" ? (items.trim() ? [items] : []) :
  (items || []).map((item) => typeof item === "string" ? item : [item.title || item.name, item.dateRange || item.dates].filter(Boolean).join(" — ")).filter(Boolean);

function ScratchField({ id, label, value, onChange, placeholder, type = "text", required = false }: {
  id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return <div><label htmlFor={id} className={scratchLabelCls}>{label}</label>
    <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className={scratchFieldCls} /></div>;
}

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
  const [docxUrl, setDocxUrl] = useState("");
  const [view, setView] = useState<"options" | "modify">("options");
  const [scratchOpen, setScratchOpen] = useState(false);
  const [scratchSubmitting, setScratchSubmitting] = useState(false);
  const [scratchError, setScratchError] = useState("");
  const [resultMode, setResultMode] = useState<"modify" | "create_from_scratch">("modify");
  const [scratch, setScratch] = useState<ScratchSubmission>({
    firstName: "", lastName: "", address: "", phone: "", email: "",
    employers: [emptyEmployer()], education: [emptyEducation()], accolades: "", idealPosition: "",
  });

  useEffect(() => {
    if (!docxBlob) { setDocxUrl(""); return; }
    const url = URL.createObjectURL(docxBlob);
    setDocxUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [docxBlob]);

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

  const handleLock = () => { sessionStorage.removeItem(RESUME_MODIFIER_STORAGE_KEY); setPassword(null); setResult(null); setDocxBlob(null); setView("options"); setScratchOpen(false); };

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
      password, mode: "modify", clientName: clientName.trim(), clientEmail: clientEmail.trim(),
      baseResumeFileName: resumeFile?.name || "", baseResumeText, baseResumeBase64,
      jobInputType,
      jobText: jobInputType === "paste" ? jobText : notes,
      jobUrl: jobInputType === "url" ? jobUrl.trim() : "",
      jobScreenshotDataUrl: jobInputType === "screenshot" ? jobScreenshotDataUrl : "",
      jobScreenshotFileName: jobInputType === "screenshot" ? jobScreenshotFileName : "",
    };
    setSubmitting(true); setResultMode("modify"); setResult(null); setDocxBlob(null);
    try {
      await requestResume(body, "Tailored-PM-Resume.docx");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  const requestResume = async (body: object, fallbackName: string) => {
      const res = await fetch(RESUME_MODIFIER_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const raw = await res.json().catch(() => null);
      const data: ResultData | null = Array.isArray(raw) ? raw[0] : raw;
      if (!res.ok || !data || data.status !== "success" || !data.docxBase64) {
        throw new Error(data?.message || `The resume service returned an error (${res.status}).`);
      }
      const blob = base64ToBlob(data.docxBase64);
      const name = data.fileName || fallbackName;
      setDocxBlob(blob); setDocxName(name); setResult(data);
      downloadBlob(blob, name);
  };

  const handleScratchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateScratchSubmission(scratch);
    if (validationError) { setScratchError(validationError); return; }
    if (!password) return;
    const body = {
      password, mode: "create_from_scratch",
      firstName: scratch.firstName.trim(), lastName: scratch.lastName.trim(), address: scratch.address.trim(),
      phone: scratch.phone.trim(), email: scratch.email.trim(),
      employers: scratch.employers.map((employer) => ({
        startDate: employer.startDate.trim(), endDate: employer.endDate.trim(), companyName: employer.companyName.trim(), position: employer.position.trim(),
      })),
      education: scratch.education.filter((entry) => entry.title.trim() || entry.dateRange.trim()).map((entry) => ({ title: entry.title.trim(), dateRange: entry.dateRange.trim() })),
      accolades: scratch.accolades.trim(), idealPosition: scratch.idealPosition.trim(),
    };
    setScratchSubmitting(true); setScratchError(""); setResultMode("create_from_scratch"); setResult(null); setDocxBlob(null);
    try {
      await requestResume(body, "PM-Resume.docx");
      setScratchOpen(false);
    } catch (err) {
      setScratchError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setScratchSubmitting(false); }
  };

  const updateEmployer = (index: number, key: keyof ScratchEmployer, value: string) => {
    setScratch((current) => ({ ...current, employers: current.employers.map((entry, i) => i === index ? { ...entry, [key]: value } : entry) }));
  };
  const updateEducation = (index: number, key: keyof ScratchEducation, value: string) => {
    setScratch((current) => ({ ...current, education: current.education.map((entry, i) => i === index ? { ...entry, [key]: value } : entry) }));
  };

  const tabs: { id: JobInputType; label: string; Icon: typeof FileText }[] = [
    { id: "paste", label: "Paste Job Text", Icon: FileText },
    { id: "screenshot", label: "Upload Screenshot", Icon: ImageIcon },
    { id: "url", label: "Enter Job URL", Icon: Link2 },
  ];

  const skills = result?.rewrittenResume?.skills ?? result?.skills;
  const skillList = Array.isArray(skills) ? skills : skills ? String(skills).split(/,\s*/) : [];
  const certifications = Array.from(new Set(["PMP", "PSM", "CPMAI", ...credentialLabels(result?.rewrittenResume?.certifications ?? result?.certifications)]));
  const education = credentialLabels(result?.rewrittenResume?.education ?? result?.education);
  const accolades = credentialLabels(result?.rewrittenResume?.accolades ?? result?.accolades);
  const summary = result?.rewrittenResume?.summary ?? result?.summary;
  const experience = result?.rewrittenResume?.experience ?? result?.experience;

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
                    {view === "modify" && <p className="text-white/80 mt-2">
                      Upload your base resume, tell us the target job, and get a tailored Word (.docx) resume.
                    </p>}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLock}
                    disabled={submitting || scratchSubmitting}
                    className="self-start sm:self-center shrink-0 border-white/25 bg-black/40 hover:bg-white/10 text-white px-4 py-2"
                  >
                    <Lock className="w-4 h-4 mr-1.5" /> Lock Page
                  </Button>
                </div>
              </div>

              {view === "options" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button className={`${choiceCls} min-h-24 h-auto text-lg px-6 py-5 gap-3`} onClick={() => { setView("modify"); setResult(null); setDocxBlob(null); }}>
                    <FileText className="w-6 h-6 shrink-0" /> Modify my resume
                  </Button>
                  <Button variant="outline" className="min-h-24 h-auto text-lg px-6 py-5 gap-3 whitespace-normal border-border/40 bg-background/60 text-[hsl(var(--article-body))]" onClick={() => { setScratchError(""); setScratchOpen(true); }}>
                    <FilePlus2 className={`w-6 h-6 shrink-0 ${goldCls}`} /> Create resume from scratch
                  </Button>
                </div>
              )}

              <div hidden={view !== "modify"} className="space-y-4">
              <Button type="button" variant="ghost" disabled={submitting} onClick={() => setView("options")} className="text-[hsl(var(--article-body))]">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to options
              </Button>
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
              </div>

              <Dialog open={scratchOpen} onOpenChange={(open) => { if (!scratchSubmitting) setScratchOpen(open); }}>
                <DialogContent aria-describedby={undefined} className="volumetric-glass !fixed !bg-background/95 w-[calc(100%-2rem)] max-w-3xl max-h-[90dvh] overflow-y-auto touch-scroll rounded-[8px] p-5 sm:p-8 [&>button]:!absolute">
                  <DialogHeader className="pr-6"><DialogTitle className={`text-2xl font-bold leading-tight ${goldCls}`}>Create Resume From Scratch</DialogTitle></DialogHeader>
                  <form onSubmit={handleScratchSubmit} className="space-y-7">
                    <fieldset disabled={scratchSubmitting} className="space-y-7 min-w-0">
                      <section className="space-y-4">
                        <h2 className={`text-xl font-bold ${goldCls}`}>Tell me about yourself</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {([
                            ["firstName", "First name", "text"], ["lastName", "Last name", "text"], ["address", "Address", "text"],
                            ["phone", "Phone number", "tel"], ["email", "Email address", "email"],
                          ] as const).map(([key, label, type]) => <ScratchField key={key} id={`scratch-${key}`} label={label} type={type} required value={scratch[key]} onChange={(value) => setScratch((current) => ({ ...current, [key]: value }))} />)}
                        </div>
                      </section>
                      <section className="space-y-4">
                        <h2 className={`text-xl font-bold ${goldCls}`}>Employment</h2>
                        {scratch.employers.map((employer, index) => (
                          <div key={index} className="space-y-3 border-b border-border/15 pb-5">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className={`font-semibold ${goldCls}`}>Employer {index + 1}</h3>
                              {scratch.employers.length > 1 && <Button type="button" variant="ghost" size="icon" title={`Remove employer ${index + 1}`} aria-label={`Remove employer ${index + 1}`} onClick={() => setScratch((current) => ({ ...current, employers: current.employers.filter((_, i) => i !== index) }))}><Trash2 className="w-4 h-4" /></Button>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <ScratchField id={`employer-${index}-start`} label="Start date" placeholder="Jan 2022" required value={employer.startDate} onChange={(value) => updateEmployer(index, "startDate", value)} />
                              <ScratchField id={`employer-${index}-end`} label="End date" placeholder="Present or Dec 2024" required value={employer.endDate} onChange={(value) => updateEmployer(index, "endDate", value)} />
                              <ScratchField id={`employer-${index}-company`} label="Company name" required value={employer.companyName} onChange={(value) => updateEmployer(index, "companyName", value)} />
                              <ScratchField id={`employer-${index}-position`} label="Position" required value={employer.position} onChange={(value) => updateEmployer(index, "position", value)} />
                            </div>
                          </div>
                        ))}
                        <Button type="button" className={`${choiceCls} h-auto min-h-11 py-3`} onClick={() => setScratch((current) => ({ ...current, employers: [...current.employers, emptyEmployer()] }))}>++ Add Employer</Button>
                      </section>
                      <section className="space-y-4">
                        <h2 className={`text-xl font-bold ${goldCls}`}>Education &amp; certifications</h2>
                        <p className="text-sm text-[hsl(var(--article-body))] border-l-2 border-[hsl(var(--quiz-highlight))] pl-3">Note: PMP, PSM, and CPMAI certifications are added automatically.</p>
                        {scratch.education.map((entry, index) => (
                          <div key={index} className="space-y-3 border-b border-border/15 pb-5">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className={`font-semibold ${goldCls}`}>Education / Certification {index + 1}</h3>
                              {scratch.education.length > 1 && <Button type="button" variant="ghost" size="icon" title={`Remove education ${index + 1}`} aria-label={`Remove education ${index + 1}`} onClick={() => setScratch((current) => ({ ...current, education: current.education.filter((_, i) => i !== index) }))}><Trash2 className="w-4 h-4" /></Button>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <ScratchField id={`education-${index}-title`} label="Education / Certification title" value={entry.title} onChange={(value) => updateEducation(index, "title", value)} />
                              <ScratchField id={`education-${index}-dates`} label="Date range" placeholder="2016 – 2020" value={entry.dateRange} onChange={(value) => updateEducation(index, "dateRange", value)} />
                            </div>
                          </div>
                        ))}
                        <Button type="button" className={`${choiceCls} h-auto min-h-11 py-3 max-w-full`} onClick={() => setScratch((current) => ({ ...current, education: [...current.education, emptyEducation()] }))}>++ Add Education / Certification</Button>
                        <div><label htmlFor="scratch-accolades" className={scratchLabelCls}>Any other accolades</label><Textarea id="scratch-accolades" value={scratch.accolades} onChange={(e) => setScratch((current) => ({ ...current, accolades: e.target.value }))} className={scratchFieldCls} rows={3} /></div>
                      </section>
                      <div><label htmlFor="scratch-ideal" className={scratchLabelCls}>Describe your ideal project management position</label><Textarea id="scratch-ideal" required value={scratch.idealPosition} onChange={(e) => setScratch((current) => ({ ...current, idealPosition: e.target.value }))} placeholder="Describe the target PM role, industry, tools, or cloud/AI/data focus you want..." className={scratchFieldCls} rows={5} /></div>
                    </fieldset>
                    {scratchError && <p role="alert" className="text-sm text-destructive">{scratchError}</p>}
                    <Button type="submit" disabled={scratchSubmitting} className={`${choiceCls} w-full h-auto min-h-12 py-3`}>
                      {scratchSubmitting ? <><Loader2 className="w-4 h-4 mr-2 shrink-0 animate-spin" /> Generating with Grok 4.7 (may take ~60s)...</> : "Create My Resume"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {result && docxBlob && (
                <div className="volumetric-glass rounded-2xl p-6 md:p-8 space-y-5 border-2 border-[#FFE361]/60">
                  <h2 className={`text-2xl font-bold ${goldCls}`}>{resultMode === "modify" ? "Your Tailored Resume Is Ready" : "Your Resume Is Ready"}</h2>
                  <span className="inline-flex max-w-full break-all border border-[hsl(var(--quiz-highlight))]/60 bg-background/60 rounded-[6px] px-3 py-2 text-[hsl(var(--article-body))] font-semibold">AI Model: {result.modelUsed || "grok-4.7"}</span>
                  <Button type="button" onClick={() => downloadBlob(docxBlob, docxName)}
                    className={`${choiceCls} w-full h-auto min-h-12 py-3`}>
                    <Download className="w-5 h-5 mr-2 shrink-0" /> Open / Download Word (.docx) Resume
                  </Button>
                  {docxUrl && <a href={docxUrl} target="_blank" rel="noopener noreferrer" className="block underline break-all text-[hsl(var(--article-body))]">Open {docxName}</a>}
                  <div className="grid sm:grid-cols-2 gap-3 text-white">
                    <div><span className="text-white/60 text-sm">Target Job</span><p className="font-semibold">{result.targetJobTitle || result.jobTitle || "—"}</p></div>
                    <div><span className="text-white/60 text-sm">Company</span><p className="font-semibold">{result.targetCompany || result.company || "—"}</p></div>
                  </div>
                  {result.matchSummary && <div><h3 className="text-lg font-bold text-[#FFE361]">Tailoring Summary</h3><p className="text-white/90 whitespace-pre-line">{result.matchSummary}</p></div>}
                  <div><h3 className={`text-lg font-bold ${goldCls}`}>Matched Job Board Roles</h3>
                    {!!result.matchedJobs?.length ? (
                      <ul className="list-disc pl-5 text-white/90 space-y-1">
                        {result.matchedJobs.map((j, i) => (
                          <li key={i}>{typeof j === "string" ? j : <>{j.url && /^https?:\/\//i.test(j.url) ? <a href={j.url} target="_blank" rel="noopener noreferrer" className="underline">{j.title}</a> : j.title}{j.company ? ` — ${j.company}` : ""}{j.score != null ? ` (${j.score})` : ""}</>}</li>
                        ))}
                      </ul>
                    ) : <p className="text-[hsl(var(--article-body))]">No matched roles returned.</p>}
                  </div>
                    <div className="space-y-4 text-[hsl(var(--article-body))]">
                      <div><h3 className={`text-lg font-bold ${goldCls}`}>Certifications</h3><ul className="list-disc pl-5">{certifications.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
                      <div><h3 className={`text-lg font-bold ${goldCls}`}>Education</h3>{education.length ? <ul className="list-disc pl-5">{education.map((item, i) => <li key={i}>{item}</li>)}</ul> : <p>No education returned.</p>}</div>
                      {!!accolades.length && <div><h3 className={`text-lg font-bold ${goldCls}`}>Accolades</h3><ul className="list-disc pl-5">{accolades.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
                      <div><h3 className={`text-lg font-bold ${goldCls}`}>Summary</h3><p className="whitespace-pre-line">{summary || "No summary returned."}</p></div>
                      <h3 className={`text-lg font-bold ${goldCls}`}>Experience</h3>
                      {experience?.length ? (
                        <div className="space-y-3">
                          {experience.map((x, i) => typeof x === "string" ? <p key={i} className="text-white/90">{x}</p> : (
                            <div key={i}>
                              <p className="font-semibold text-white">{[x.title, x.company].filter(Boolean).join(" — ")}{x.dates ? <span className="text-white/60 font-normal"> · {x.dates}</span> : null}</p>
                              {!!x.bullets?.length && <ul className="list-disc pl-5 text-white/85 text-sm space-y-0.5">{x.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>}
                            </div>
                          ))}
                        </div>
                      ) : <p>No experience returned.</p>}
                      <h3 className={`text-lg font-bold ${goldCls}`}>Skills</h3>
                      {skillList.length ? <div className="flex flex-wrap gap-2">{skillList.map((s, i) => <span key={i} className="text-xs px-2 py-1 rounded-[6px] bg-secondary border border-border/20">{s}</span>)}</div> : <p>No skills returned.</p>}
                    </div>
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
