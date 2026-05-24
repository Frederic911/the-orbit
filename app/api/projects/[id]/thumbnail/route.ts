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

  let projects;
  try {
    projects = await getProjects();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load projects", detail: String(err) },
      { status: 500 }
    );
  }

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  let formData;
  try {
    formData = await req.formData();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse upload", detail: String(err) },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image (JPG, PNG, or WebP)" },
      { status: 400 }
    );
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image must be under 4MB" },
      { status: 400 }
    );
  }

  // Delete old thumbnail BEFORE uploading new one to avoid "blob already exists"
  if (projects[index].thumbnail) {
    try {
      await del(projects[index].thumbnail!);
    } catch {
      // Old blob may already be gone — continue
    }
  }

  try {
    // Use timestamp in filename to guarantee uniqueness
    const ext = file.name.split(".").pop() || "jpg";
    const blobPath = `thumbnails/${id}-${Date.now()}.${ext}`;

    const blob = await put(blobPath, file, {
      access: "public",
      contentType: file.type,
    });

    projects[index].thumbnail = blob.url;
    await saveProjects(projects);

    return NextResponse.json({ thumbnail: blob.url });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to upload image", detail: String(err) },
      { status: 500 }
    );
  }
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
