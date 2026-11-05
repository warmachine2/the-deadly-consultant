export type ReadinessTier = "enterprise" | "emerging" | "foundation";

export const readinessTier = (score: number): ReadinessTier =>
  score >= 75 ? "enterprise" : score >= 50 ? "emerging" : "foundation";

export const resultPath = (mqlQualified: boolean) => mqlQualified === true ? "qualified" : "foundation";

const ROLE_PACKAGING: Record<string, string> = {
  Data_Analyst: "Your Data / BI / SQL analyst background brings analytics fluency. Package dashboards and reporting outcomes as enterprise delivery ownership, stakeholder decisions, and measurable business impact.",
  BA_Scrum: "Your BA / Systems / Scrum background brings requirements and sprint experience. Package that work as end-to-end delivery leadership, dependency management, and stakeholder alignment.",
  Coordinator_Ops: "Your coordination / PMO / operations background brings execution discipline. Replace task-support positioning with owned milestones, delivery governance, and measurable operational outcomes.",
  Dev_Eng: "Your development / QA / engineering background brings technical depth. Translate implementation work into cross-functional delivery leadership, risk decisions, and business outcomes.",
  Finance_Corp: "Your finance / corporate background brings controls and business context. Package process improvements, reporting, and compliance work as enterprise transformation delivery.",
  Other_WhiteCollar: "Your white-collar background can provide transferable stakeholder and process experience. Build a clear bridge from those responsibilities to measurable Data & AI project delivery.",
  Other_General: "Your non-corporate background needs a clear bridge into enterprise delivery. Build foundational stakeholder, requirements, and project execution experience before positioning for consulting.",
};

export const marketPackagingInsight = (rolePond: string) =>
  `${ROLE_PACKAGING[rolePond] ?? ROLE_PACKAGING.Other_WhiteCollar} Live $85–$120/hr GTA enterprise contracts look for evidence of scope, accountability, and delivery outcomes—not just a job title.`;