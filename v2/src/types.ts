export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  skills: Skill[];
}

export interface Rater {
  name: string;
  status: "pending" | "submitted" | "declined";
}

export interface FeedbackRequest {
  id: string;
  subjectId: string;
  subjectName: string;
  status: "pending" | "completed" | "cancelled";
  dateRequested: string;
  raters: Rater[];
  competencies: string[];
  personalNote?: string;
}

export interface BiasRule {
  pattern: RegExp;
  message: string;
  type: "warning" | "info";
}
