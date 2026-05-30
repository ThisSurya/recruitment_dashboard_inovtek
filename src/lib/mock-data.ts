export type JobStatus = "Open" | "Closed" | "Draft";
export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship";

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  description: string;
  requirements: string;
  createdAt: string; // ISO
};

export type PipelineStage = "Applied" | "Interview" | "Hired";

export type Application = {
  id: string;
  candidateName: string;
  email: string;
  appliedPosition: string;
  applicationDate: string; // ISO
  stage: PipelineStage;
};

export type Activity = {
  id: string;
  type: "Candidate applied" | "Interview scheduled" | "Candidate hired";
  detail: string;
  at: string; // ISO
};

export const INITIAL_JOBS: Job[] = [
  {
    id: "job_1",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Jakarta, ID",
    employmentType: "Full-time",
    status: "Open",
    description:
      "Build and maintain a modern React + TypeScript web app with high UX standards.",
    requirements:
      "5+ years experience, strong TypeScript, React, testing fundamentals.",
    createdAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "job_2",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    employmentType: "Full-time",
    status: "Open",
    description:
      "Design clean SaaS experiences, collaborate with product and engineering.",
    requirements:
      "Strong portfolio, systems thinking, Figma, ability to ship.",
    createdAt: "2026-05-08T11:30:00.000Z",
  },
  {
    id: "job_3",
    title: "Talent Acquisition Specialist",
    department: "People",
    location: "Bandung, ID",
    employmentType: "Full-time",
    status: "Draft",
    description: "Own end-to-end hiring for key roles.",
    requirements: "3+ years recruiting experience, stakeholder management.",
    createdAt: "2026-05-05T15:45:00.000Z",
  },
  {
    id: "job_4",
    title: "Backend Engineer (Node.js)",
    department: "Engineering",
    location: "Surabaya, ID",
    employmentType: "Contract",
    status: "Closed",
    description:
      "Implement APIs and services with strong reliability and security practices.",
    requirements: "Node.js, databases, REST, performance and observability.",
    createdAt: "2026-04-28T08:10:00.000Z",
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app_1",
    candidateName: "John Doe",
    appliedPosition: "Senior Frontend Engineer",
    email: "john.doe@email.com",
    applicationDate: "2026-05-20T07:10:00.000Z",
    stage: "Applied",
  },
  {
    id: "app_2",
    candidateName: "Sarah Wilson",
    appliedPosition: "Product Designer",
    email: "sarah.wilson@email.com",
    applicationDate: "2026-05-18T10:00:00.000Z",
    stage: "Interview",
  },
  {
    id: "app_3",
    candidateName: "Michael Johnson",
    appliedPosition: "Backend Engineer (Node.js)",
    email: "michael.johnson@email.com",
    applicationDate: "2026-05-14T13:25:00.000Z",
    stage: "Applied",
  },
  {
    id: "app_4",
    candidateName: "Emma Brown",
    appliedPosition: "Senior Frontend Engineer",
    email: "emma.brown@email.com",
    applicationDate: "2026-05-12T09:40:00.000Z",
    stage: "Hired",
  },
];

export const INITIAL_ACTIVITY: Activity[] = [
  {
    id: "act_1",
    type: "Candidate applied",
    detail: "John Doe applied for Senior Frontend Engineer",
    at: "2026-05-20T07:10:00.000Z",
  },
  {
    id: "act_2",
    type: "Interview scheduled",
    detail: "Interview scheduled with Sarah Wilson",
    at: "2026-05-19T12:00:00.000Z",
  },
  {
    id: "act_3",
    type: "Candidate hired",
    detail: "Emma Brown moved to Hired",
    at: "2026-05-16T09:30:00.000Z",
  },
];
