"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
  useDraggable,
  closestCorners,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Users } from "lucide-react";

import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/format";
import {
  type Application,
  type PipelineStage,
} from "@/lib/mock-data";
import { useAtsStore } from "@/stores/ats-store";

const STAGES: PipelineStage[] = ["Applied", "Interview", "Hired"];

function columnId(stage: PipelineStage) {
  return `column:${stage}`;
}

function PipelineColumn({
  stage,
  items,
  activeId,
}: {
  stage: PipelineStage;
  items: Application[];
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId(stage) });

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 md:min-w-65">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-900">{stage}</div>
        <div className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {items.length}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm",
          isOver && "ring-2 ring-zinc-300",
        )}
      >
        {items.map((app) => (
          <CandidateCard
            key={app.id}
            application={app}
            active={activeId === app.id}
          />
        ))}

        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-500">
            Drop candidates here
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateCard({
  application,
  active,
}: {
  application: Application;
  active: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({ id: application.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? undefined : "transform 180ms ease",
  };

  return (
    <div
      ref={setDragRef}
      style={style}
      className={cn(
        "cursor-grab rounded-xl border border-zinc-200 bg-white p-3 shadow-sm",
        isDragging && "opacity-60",
        active && "ring-2 ring-zinc-300",
      )}
      {...listeners}
      {...attributes}
    >
      <CandidateCardBody application={application} />
    </div>
  );
}

function CandidateCardBody({ application }: { application: Application }) {
  return (
    <>
      <div className="text-sm font-semibold text-zinc-900">
        {application.candidateName}
      </div>
      <div className="mt-1 text-sm text-zinc-600">
        {application.appliedPosition}
      </div>
      <div className="mt-2 text-xs text-zinc-500">{application.email}</div>
      <div className="mt-2 text-xs text-zinc-500">
        Applied {formatShortDate(application.applicationDate)}
      </div>
    </>
  );
}

function MobileStageSection({
  stage,
  items,
  onMove,
}: {
  stage: PipelineStage;
  items: Application[];
  onMove: (id: string, stage: PipelineStage) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-900">{stage}</div>
        <div className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {items.length}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
        {items.map((app) => (
          <div
            key={app.id}
            className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
          >
            <CandidateCardBody application={app} />

            <div className="mt-3">
              <div className="text-[11px] font-medium text-zinc-500">Stage</div>
              <select
                value={app.stage}
                onChange={(e) => {
                  const next = e.currentTarget.value as PipelineStage;
                  if (next !== app.stage) onMove(app.id, next);
                }}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Change stage"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-500">
            No candidates in this stage.
          </div>
        )}
      </div>
    </div>
  );
}

function stageFromOverId(overId: unknown): PipelineStage | null {
  if (typeof overId !== "string") return null;
  if (!overId.startsWith("column:")) return null;
  const stage = overId.replace("column:", "") as PipelineStage;
  return STAGES.includes(stage) ? stage : null;
}

export default function PipelinePage() {
  const applications = useAtsStore((s) => s.applications);
  const moveApplication = useAtsStore((s) => s.moveApplication);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const activeApplication =
    activeId == null
      ? null
      : applications.find((a) => a.id === activeId) ?? null;

  React.useEffect(() => {
    if (!activeId) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeId]);

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragCancel() {
    setActiveId(null);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const overId = event.over?.id;
    if (!overId) return;

    const id = String(event.active.id);
    const targetStage = stageFromOverId(overId);

    if (!targetStage) return;

    const current = applications.find((a) => a.id === id);
    if (!current) return;

    if (current.stage !== targetStage) {
      moveApplication(id, targetStage);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Candidates Pipeline</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Update candidate stages across your hiring pipeline.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Users className="h-4 w-4 text-zinc-600" />
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Mobile: no drag & drop, use stage dropdown */}
          <div className="space-y-6 md:hidden">
            {STAGES.map((stage) => (
              <MobileStageSection
                key={stage}
                stage={stage}
                items={applications.filter((a) => a.stage === stage)}
                onMove={moveApplication}
              />
            ))}
          </div>

          {/* Desktop/tablet: drag & drop kanban */}
          <div className="hidden md:block">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              modifiers={[restrictToFirstScrollableAncestor, restrictToWindowEdges]}
              onDragStart={onDragStart}
              onDragCancel={onDragCancel}
              onDragEnd={onDragEnd}
            >
              <div className="flex gap-4 overflow-x-auto pb-2">
                {STAGES.map((stage) => (
                  <PipelineColumn
                    key={stage}
                    stage={stage}
                    items={applications.filter((a) => a.stage === stage)}
                    activeId={activeId}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeApplication ? (
                  <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                    <CandidateCardBody application={activeApplication} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
