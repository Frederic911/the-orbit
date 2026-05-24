import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getProjects, saveProjects } from "@/lib/storage";
import { checkAuth } from "@/lib/auth";
import { Project } from "@/lib/types";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const { name, category, date, description, liveUrl, githubUrl } = body;

  if (!name || !category || !date) {
    return NextResponse.json(
      { error: "Missing required fields: name, category, date" },
      { status: 400 }
    );
  }

  const valid = ["Startup Ops", "Hobby Builds", "Client Projects"];
  if (!valid.includes(category)) {
    return NextResponse.json(
      { error: `category must be one of: ${valid.join(", ")}` },
      { status: 400 }
    );
  }

  const project: Project = {
    id: nanoid(10),
    name,
    category,
    date,
    description: description || "",
    thumbnail: null,
    liveUrl: liveUrl || null,
    githubUrl: githubUrl || null,
  };

  const projects = await getProjects();
  projects.push(project);
  await saveProjects(projects);

  return NextResponse.json(project, { status: 201 });
}
