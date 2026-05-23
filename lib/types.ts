export interface Project {
  id: string;
  name: string;
  category: "Startup Ops" | "Hobby Builds" | "Client Projects";
  date: string;
  description: string;
  thumbnail: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
}
