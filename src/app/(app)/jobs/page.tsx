"use client";

import * as React from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Briefcase,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatShortDate } from "@/lib/format";
import {
  type EmploymentType,
  type Job,
  type JobStatus,
} from "@/lib/mock-data";
import { useAtsStore } from "@/stores/ats-store";

const jobSchema = z.object({
  title: z.string().min(1, "Job Title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  status: z.enum(["Open", "Closed", "Draft"]),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements is required"),
});

type JobFormValues = z.infer<typeof jobSchema>;

function statusBadgeVariant(status: JobStatus) {
  if (status === "Open") return "success";
  if (status === "Closed") return "muted";
  return "warning";
}

export default function JobsPage() {
  const jobs = useAtsStore((s) => s.jobs);
  const addJob = useAtsStore((s) => s.addJob);
  const updateJob = useAtsStore((s) => s.updateJob);
  const deleteJob = useAtsStore((s) => s.deleteJob);

  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<JobStatus | "All">(
    "All",
  );

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"add" | "edit" | "view">("add");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const activeJob =
    activeId == null ? null : jobs.find((j) => j.id === activeId) ?? null;

  const filtered = jobs.filter((j) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q.length === 0 ||
      j.title.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || j.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      employmentType: "Full-time",
      status: "Open",
      description: "",
      requirements: "",
    },
  });

  function openAdd() {
    setMode("add");
    setActiveId(null);
    form.reset({
      title: "",
      department: "",
      location: "",
      employmentType: "Full-time",
      status: "Open",
      description: "",
      requirements: "",
    });
    setDialogOpen(true);
  }

  function openEdit(job: Job) {
    setMode("edit");
    setActiveId(job.id);
    form.reset({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
    });
    setDialogOpen(true);
  }

  function openView(job: Job) {
    setMode("view");
    setActiveId(job.id);
    setDialogOpen(true);
  }

  function onDelete(job: Job) {
    const ok = confirm(`Delete job "${job.title}"?`);
    if (!ok) return;
    deleteJob(job.id);
  }

  function onSubmit(values: JobFormValues) {
    if (mode === "add") {
      addJob(values);
    } else if (mode === "edit" && activeId) {
      updateJob(activeId, values);
    }

    setDialogOpen(false);
  }

  const footer =
    mode === "view" ? (
      <Button variant="secondary" onClick={() => setDialogOpen(false)}>
        Close
      </Button>
    ) : (
      <>
        <Button variant="secondary" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
      </>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Jobs</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage job postings across departments.
          </p>
        </div>

        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add New Job
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-zinc-600" />
            <CardTitle>Job List</CardTitle>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="Search by title or department"
                className="pl-9"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.currentTarget.value as JobStatus | "All")
              }
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-44"
              aria-label="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Mobile: card list (no horizontal scroll) */}
          <div className="space-y-3 md:hidden">
            {filtered.map((j) => (
              <div
                key={j.id}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-900">
                      {j.title}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Created {formatShortDate(j.createdAt)}
                    </div>
                  </div>
                  <Badge variant={statusBadgeVariant(j.status)}>{j.status}</Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-700">
                  <div>
                    <div className="text-[11px] font-medium text-zinc-500">
                      Department
                    </div>
                    <div className="mt-0.5 truncate text-zinc-900">
                      {j.department}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-zinc-500">
                      Location
                    </div>
                    <div className="mt-0.5 truncate text-zinc-900">
                      {j.location}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[11px] font-medium text-zinc-500">
                      Employment Type
                    </div>
                    <div className="mt-0.5 text-zinc-900">{j.employmentType}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openView(j)}
                    aria-label="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(j)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(j)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-lg border border-zinc-200 bg-white px-4 py-10 text-center text-sm text-zinc-500">
                No jobs found.
              </div>
            )}
          </div>

          {/* Desktop/tablet: table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs font-medium text-zinc-500">
                  <th className="border-b border-zinc-200 px-3 py-2">Job Title</th>
                  <th className="border-b border-zinc-200 px-3 py-2">Department</th>
                  <th className="border-b border-zinc-200 px-3 py-2">Location</th>
                  <th className="border-b border-zinc-200 px-3 py-2">
                    Employment Type
                  </th>
                  <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                  <th className="border-b border-zinc-200 px-3 py-2">Created Date</th>
                  <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((j) => (
                  <tr key={j.id} className="text-sm text-zinc-700">
                    <td className="border-b border-zinc-100 px-3 py-3 font-medium text-zinc-900">
                      {j.title}
                    </td>
                    <td className="border-b border-zinc-100 px-3 py-3">
                      {j.department}
                    </td>
                    <td className="border-b border-zinc-100 px-3 py-3">
                      {j.location}
                    </td>
                    <td className="border-b border-zinc-100 px-3 py-3">
                      {j.employmentType}
                    </td>
                    <td className="border-b border-zinc-100 px-3 py-3">
                      <Badge variant={statusBadgeVariant(j.status)}>{j.status}</Badge>
                    </td>
                    <td className="border-b border-zinc-100 px-3 py-3">
                      {formatShortDate(j.createdAt)}
                    </td>
                    <td className="border-b border-zinc-100 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openView(j)}
                          aria-label="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(j)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(j)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-10 text-center text-sm text-zinc-500"
                    >
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          mode === "add"
            ? "Add New Job"
            : mode === "edit"
              ? "Edit Job"
              : "View Job"
        }
        footer={footer}
      >
        {mode === "view" && activeJob ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-zinc-500">Job Title</div>
              <div className="mt-1 text-sm text-zinc-900">{activeJob.title}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500">Department</div>
              <div className="mt-1 text-sm text-zinc-900">
                {activeJob.department}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500">Location</div>
              <div className="mt-1 text-sm text-zinc-900">
                {activeJob.location}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500">Employment Type</div>
              <div className="mt-1 text-sm text-zinc-900">
                {activeJob.employmentType}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500">Status</div>
              <div className="mt-1">
                <Badge variant={statusBadgeVariant(activeJob.status)}>
                  {activeJob.status}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500">Created</div>
              <div className="mt-1 text-sm text-zinc-900">
                {formatShortDate(activeJob.createdAt)}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs font-medium text-zinc-500">Description</div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">
                {activeJob.description}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs font-medium text-zinc-500">Requirements</div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">
                {activeJob.requirements}
              </div>
            </div>
          </div>
        ) : (
          <form className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" {...form.register("department")} />
              {form.formState.errors.department && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.department.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
              {form.formState.errors.location && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <select
                id="employmentType"
                {...form.register("employmentType")}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {(
                  [
                    "Full-time",
                    "Part-time",
                    "Contract",
                    "Internship",
                  ] satisfies EmploymentType[]
                ).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...form.register("status")}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {(["Open", "Closed", "Draft"] satisfies JobStatus[]).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea id="requirements" {...form.register("requirements")} />
              {form.formState.errors.requirements && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.requirements.message}
                </p>
              )}
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
