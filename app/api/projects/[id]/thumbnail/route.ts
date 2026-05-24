import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { getProjects, saveProjects } from "@/lib/storage";
import { checkAuth } from "@/lib/auth";

export async function POST(
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

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(`thumbnails/${id}-${file.name}`, file, {
    access: "public",
    contentType: file.type,
  });

  // Delete old thumbnail blob if it exists
  if (projects[index].thumbnail) {
    try {
      await del(projects[index].thumbnail!);
    } catch {
      // Old blob may already be gone
    }
  }

  projects[index].thumbnail = blob.url;
  await saveProjects(projects);

  return NextResponse.json({ thumbnail: blob.url });
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

  if (projects[index].thumbnail) {
    try {
      await del(projects[index].thumbnail!);
    } catch {
      // Blob may already be gone
    }
  }

  projects[index].thumbnail = null;
  await saveProjects(projects);

  return NextResponse.json({ thumbnail: null });
}
