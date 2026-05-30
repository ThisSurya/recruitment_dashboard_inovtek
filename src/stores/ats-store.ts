"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  type Activity,
  type Application,
  type Job,
  type JobStatus,
  type PipelineStage,
  INITIAL_ACTIVITY,
  INITIAL_APPLICATIONS,
  INITIAL_JOBS,
} from "@/lib/mock-data";

function uid(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);
  return `${prefix}_${random}`;
}

export type AtsState = {
  jobs: Job[];
  applications: Application[];
  activity: Activity[];

  addJob: (job: Omit<Job, "id" | "createdAt">) => void;
  updateJob: (id: string, patch: Partial<Omit<Job, "id">>) => void;
  deleteJob: (id: string) => void;

  moveApplication: (id: string, stage: PipelineStage) => void;
};

export const useAtsStore = create<AtsState>()(
  persist(
    (set) => ({
      jobs: INITIAL_JOBS,
      applications: INITIAL_APPLICATIONS,
      activity: INITIAL_ACTIVITY,

      addJob: (job) =>
        set((state) => ({
          jobs: [
            {
              ...job,
              id: uid("job"),
              createdAt: new Date().toISOString(),
            },
            ...state.jobs,
          ],
        })),

      updateJob: (id, patch) =>
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      deleteJob: (id) =>
        set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),

      moveApplication: (id, stage) =>
        set((state) => {
          const existing = state.applications.find((a) => a.id === id);
          if (!existing) return state;

          const applications = state.applications.map((a) =>
            a.id === id ? { ...a, stage } : a,
          );

          let activityType: Activity["type"] = "Candidate applied";
          if (stage === "Interview") activityType = "Interview scheduled";
          if (stage === "Hired") activityType = "Candidate hired";

          const activity: Activity = {
            id: uid("act"),
            type: activityType,
            detail: `${existing.candidateName} moved to ${stage}`,
            at: new Date().toISOString(),
          };

          return { applications, activity: [activity, ...state.activity].slice(0, 8) };
        }),
    }),
    {
      name: "ats-store",
      version: 1,
      partialize: (state) => ({
        jobs: state.jobs,
        applications: state.applications,
        activity: state.activity,
      }),
    },
  ),
);

export function countJobsByStatus(jobs: Job[], status: JobStatus) {
  return jobs.filter((j) => j.status === status).length;
}
