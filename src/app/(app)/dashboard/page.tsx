"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  UserRound,
  Activity as ActivityIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/format";
import { useAtsStore } from "@/stores/ats-store";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-3xl font-semibold tracking-tight text-zinc-900">
          {value}
        </div>
        <div className="mt-2 flex items-center gap-1 text-sm text-zinc-600">
          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          <span className="text-emerald-700">{trend}</span>
          <span className="text-zinc-500">vs last 30 days</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const jobs = useAtsStore((s) => s.jobs);
  const applications = useAtsStore((s) => s.applications);
  const activity = useAtsStore((s) => s.activity);

  const totalJobs = jobs.length;
  const totalCandidates = new Set(applications.map((a) => a.email)).size;
  const totalApplications = applications.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Overview of your recruitment pipeline.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/jobs">Add New Job</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/pipeline">View Candidates</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/pipeline">Create Application</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total Jobs"
          value={totalJobs}
          icon={Briefcase}
          trend={"+8%"}
        />
        <StatCard
          title="Total Candidates"
          value={totalCandidates}
          icon={UserRound}
          trend={"+5%"}
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={FileText}
          trend={"+12%"}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <ActivityIcon className="h-4 w-4 text-zinc-600" />
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="divide-y divide-zinc-100">
            {activity.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-zinc-900">
                    {a.type}
                  </div>
                  <div className="mt-0.5 text-sm text-zinc-600">{a.detail}</div>
                </div>
                <div className="text-sm text-zinc-500">{formatTimeAgo(a.at)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
