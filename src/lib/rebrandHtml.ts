/**
 * Normalizes legacy branding in CMS (Ghost) content:
 * - old domain -> zerotopmconsultant.com
 * - "The Deadly Consultant" / "Deadly Consultant" -> "Zero to PM Consultant"
 * - "© 2025" -> "© 2026"
 */
export const rebrandHtml = (html: string): string => {
  if (!html) return html;
  return html
    .replace(/https?:\/\/(www\.)?(app\.)?thedeadlyconsultant\.com/gi, "https://www.zerotopmconsultant.com")
    .replace(/(www\.)?thedeadlyconsultant\.com/gi, "zerotopmconsultant.com")
    .replace(/(www\.)?deadlyconsultant\.com/gi, "zerotopmconsultant.com")
    .replace(/The\s+Deadly\s+Consultant/gi, "Zero to PM Consultant")
    .replace(/Deadly\s+Consultant/gi, "Zero to PM Consultant")
    .replace(/(©|&copy;)\s*2025/gi, "© 2026");
};
