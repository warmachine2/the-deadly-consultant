import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export interface StudentIntakePdfParams {
  fullName: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  currentRole: string;
  contractLocation: string;
  resumeFileName: string;
  submittedAt?: string;
}

const clean = (v: string) =>
  v.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9-]/g, "");

/** "John Doe" -> "Doe-John-intake-form.pdf" */
export const buildIntakePdfFileName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).map(clean).filter(Boolean);
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  const first = parts.length > 1 ? parts.slice(0, -1).join("-") : parts[0] || "Student";
  const base = [last, first].filter(Boolean).join("-").replace(/-+/g, "-");
  return `${base || "Student"}-intake-form.pdf`;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const GOLD = "#C58A00";
const INK = "#0F172A";
const MUTED = "#64748B";
const LINE = "#E2E8F0";

const pill = (text: string, bg: string, fg: string) =>
  `<span style="display:inline-block;padding:0 10px 6px;line-height:14px;border-radius:999px;background:${bg};color:${fg};font-size:10px;font-weight:700;letter-spacing:.04em;">${text}</span>`;

const emblem = `
<svg width="96" height="96" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs><path id="arcTop" d="M 18 60 A 42 42 0 0 1 102 60"/><path id="arcBot" d="M 14 60 A 46 46 0 0 0 106 60"/></defs>
  <circle cx="60" cy="60" r="57" fill="${INK}"/>
  <circle cx="60" cy="60" r="52" fill="none" stroke="${GOLD}" stroke-width="2"/>
  <circle cx="60" cy="60" r="32" fill="none" stroke="${GOLD}" stroke-width="1"/>
  <text font-family="Helvetica,Arial" font-size="7.2" font-weight="700" fill="#FFE361" letter-spacing=".5"><textPath href="#arcTop" startOffset="50%" text-anchor="middle">DATA &amp; AI ORCHESTRATION PM ACCELERATOR</textPath></text>
  <text font-family="Helvetica,Arial" font-size="7.5" font-weight="700" fill="#FFE361" letter-spacing=".5"><textPath href="#arcBot" startOffset="50%" text-anchor="middle">ROADMAP TO 10K/MO+</textPath></text>
  <text x="60" y="56" text-anchor="middle" font-family="Helvetica,Arial" font-size="9" font-weight="700" fill="#FFFFFF">YOUR 90D</text>
  <text x="60" y="68" text-anchor="middle" font-family="Helvetica,Arial" font-size="9" font-weight="700" fill="#FFE361">AI-PROOF PIVOT</text>
</svg>`;

export async function generateIntakePdf(
  params: StudentIntakePdfParams,
): Promise<{ pdfBlob: Blob; pdfFileName: string } | null> {
  let host: HTMLDivElement | null = null;
  try {
    const pdfFileName = buildIntakePdfFileName(params.fullName);
    const date = params.submittedAt ? new Date(params.submittedAt) : new Date();
    const tz = "America/Toronto";
    const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
      .format(date).replace(/-/g, "");
    const recordId = `INTAKE-${ymd}-001`;
    const stamp = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit",
    }).format(date);
    const time = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(date);

    const p = {
      fullName: esc(params.fullName), email: esc(params.email), whatsapp: esc(params.whatsapp),
      linkedin: esc(params.linkedin), currentRole: esc(params.currentRole),
      contractLocation: esc(params.contractLocation), resume: esc(params.resumeFileName),
    };
    const linkedinShort = p.linkedin.replace(/^https?:\/\/(www\.)?/i, "");

    const card = (label: string, value: string, extra = "") => `
      <div style="border:1px solid ${LINE};border-radius:8px;padding:12px 14px;background:#F8FAFC;">
        <div style="font-size:9.5px;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:6px;">${label} ${extra}</div>
        <div style="font-size:13px;color:${INK};font-weight:600;word-break:break-all;">${value}</div>
      </div>`;
    const section = (n: string, title: string) => `
      <div style="display:flex;align-items:center;gap:10px;margin:20px 0 10px;">
        <span style="font-size:11px;font-weight:800;color:${GOLD};">${n}</span>
        <span style="font-size:13px;font-weight:800;color:${INK};text-transform:uppercase;letter-spacing:.06em;">${title}</span>
        <span style="flex:1;height:1px;background:${LINE};"></span>
      </div>`;
    const th = `style="text-align:left;padding:8px 10px;font-size:9.5px;color:${MUTED};text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid ${LINE};"`;
    const td = `style="padding:9px 10px;font-size:11.5px;color:${INK};border-bottom:1px solid ${LINE};vertical-align:top;"`;

    host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;height:1123px;background:#fff;";
    host.innerHTML = `
<div style="width:794px;height:1123px;box-sizing:border-box;padding:40px 48px;font-family:Helvetica,Arial,sans-serif;color:${INK};background:#fff;position:relative;">
  <div style="display:flex;align-items:center;gap:18px;padding-bottom:16px;border-bottom:3px solid ${GOLD};">
    ${emblem}
    <div style="flex:1;">
      <div style="font-size:22px;font-weight:800;color:${INK};">Data &amp; <span style="color:${GOLD}">AI Orchestration PM Consulting</span></div>
      <div style="font-size:12px;color:${MUTED};margin-top:4px;">Zero to <span style="color:${GOLD};font-weight:700;">PM</span> Consultant · Internal Enrollment Record</div>
    </div>
    <div style="text-align:right;font-size:10.5px;color:${MUTED};line-height:1.6;">
      <div style="font-weight:800;color:${INK};font-size:11.5px;">${recordId}</div>
      <div>Prepared for Hassan Khan</div>
    </div>
  </div>

  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;">
    <div style="font-size:17px;font-weight:800;">Student Intake Record — Official Enrollment Dossier</div>
    <div style="display:flex;gap:6px;">
      ${pill("OFFICIAL DOSSIER", GOLD, "#fff")}
      <span style="display:inline-block;padding:0 9px 5px;line-height:14px;border-radius:999px;border:1px solid ${INK};color:${INK};font-size:10px;font-weight:700;letter-spacing:.04em;">INTERNAL USE</span>
    </div>
  </div>
  <div style="margin-top:10px;padding:8px 12px;background:#F1F5F9;border-radius:6px;font-size:10.5px;color:${MUTED};">
    <b style="color:${INK}">Timestamp:</b> ${stamp} EDT &nbsp;|&nbsp; <b style="color:${INK}">Source:</b> zerotopmconsultant.com &nbsp;|&nbsp; <b style="color:${INK}">Archive:</b> Student Intake / ${p.fullName} /
  </div>

  ${section("01", "Student Contact &amp; Identification")}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    ${card("Full Name", p.fullName)}
    ${card("Email Used at Checkout", p.email, `<span style="margin-left:6px;padding:0 6px 4px;line-height:12px;border-radius:4px;background:#FEF3C7;color:${GOLD};font-size:8.5px;">MATCH EMAIL TO PAYMENT</span>`)}
    ${card("WhatsApp Number", p.whatsapp)}
    ${card("LinkedIn Profile", `<span style="color:#1D4ED8;text-decoration:underline;">${linkedinShort}</span>`)}
  </div>

  ${section("02", "Professional &amp; Placement Details")}
  <table style="width:100%;border-collapse:collapse;">
    <tr><td ${td} width="34%"><b>Current Title &amp; Employer</b></td><td ${td}>${p.currentRole}</td></tr>
    <tr><td ${td}><b>Contract Location</b></td><td ${td}>${p.contractLocation}</td></tr>
    <tr><td ${td}><b>Uploaded Resume File</b></td><td ${td}>${p.resume}<div style="font-size:10px;color:${MUTED};margin-top:3px;">Paired with companion dossier: ${esc(pdfFileName)}</div></td></tr>
  </table>

  ${section("03", "Internal Administrative Checklist")}
  <table style="width:100%;border-collapse:collapse;">
    <tr><th ${th}>Task</th><th ${th}>Owner</th><th ${th}>Status</th><th ${th}>Completed</th></tr>
    <tr><td ${td}>Added to Student WhatsApp Group (within 24h)</td><td ${td}>Hassan Khan</td><td ${td}>${pill("PENDING", "#FEF3C7", "#B45309")}</td><td ${td}>—</td></tr>
    <tr><td ${td}>Resume Remake Initiated</td><td ${td}>Lead Instructor</td><td ${td}>${pill("QUEUED", "#DBEAFE", "#1D4ED8")}</td><td ${td}>—</td></tr>
    <tr><td ${td}>Folder Archived in Cloud OneDrive</td><td ${td}>Automation System</td><td ${td}>${pill("COMPLETED (AUTO)", "#DCFCE7", "#15803D")}</td><td ${td}>${time}</td></tr>
  </table>

  <div style="margin-top:20px;padding:14px 16px;border-left:4px solid ${GOLD};background:#FFFBEB;border-radius:6px;font-size:11.5px;line-height:1.6;">
    <div style="font-weight:800;color:${GOLD};font-size:10.5px;letter-spacing:.08em;margin-bottom:4px;">OPERATOR NOTE</div>
    Do not use any prior resume. Remake starts from <b>${p.resume}</b> filed in this folder. Add <b>${p.whatsapp}</b> to the student group within 24 hours. Confirm checkout email <b>${p.email}</b> matches payment before any external send.
  </div>

  <div style="position:absolute;left:48px;right:48px;bottom:30px;border-top:1px solid ${LINE};padding-top:10px;text-align:center;font-size:8.5px;color:${MUTED};letter-spacing:.06em;">
    CONFIDENTIAL &amp; PROPRIETARY — INTERNAL USE ONLY | DATA &amp; AI ORCHESTRATION PM CONSULTING · HASSAN KHAN · ${recordId}
  </div>
</div>`;
    document.body.appendChild(host);

    const canvas = await html2canvas(host.firstElementChild as HTMLElement, {
      scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
    });
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
    return { pdfBlob: pdf.output("blob"), pdfFileName };
  } catch (err) {
    console.error("Intake PDF generation failed", err);
    return null;
  } finally {
    host?.remove();
  }
}
