import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/storage";
import { checkAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const allowed = ["name", "category", "date", "description", "thumbnail", "liveUrl", "githubUrl"];
  for (const key of allowed) {
    if (key in body) {
      (projects[index] as unknown as Record<string, unknown>)[key] = body[key];
    }
  }

  if (body.category) {
    const valid = ["Startup Ops", "Hobby Builds", "Client Projects"];
    if (!valid.includes(body.category)) {
      return NextResponse.json(
        { error: `category must be one of: ${valid.join(", ")}` },
        { status: 400 }
      );
    }
  }

  await saveProjects(projects);
  return NextResponse.json(projects[index]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const removed = projects.splice(index, 1)[0];
  await saveProjects(projects);
  return NextResponse.json({ deleted: removed.id });
}
