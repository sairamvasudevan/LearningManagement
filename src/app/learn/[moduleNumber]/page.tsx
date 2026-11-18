import { notFound, redirect } from "next/navigation";
import { requireIdentity } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ModulePlayer } from "@/components/module-player";
import catalog from "@/lib/course-catalog.json";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ moduleNumber: string }> };

export default async function LearnModulePage({ params }: PageProps) {
  const { moduleNumber: raw } = await params;
  const moduleNumber = Number(raw);
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 100) notFound();
  const identity = await requireIdentity();
  const supabase = await createClient();
  const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", identity.id).maybeSingle();
  if (role?.role === "admin") redirect("/admin");
  const { data: permitted, error: accessError } = await supabase.rpc("can_access_module", { p_module_number: moduleNumber });
  if (accessError || permitted !== true) redirect("/portal");
  const { data: moduleRow } = await supabase.from("course_modules").select("module_number,title,objective,content_status").eq("module_number", moduleNumber).maybeSingle();
  if (!moduleRow || moduleRow.content_status !== "published") redirect("/portal");
  const { data: questionRows, error } = await supabase.from("assessment_questions")
    .select("question_id,sort_order,title,prompt,options,hints,marks")
    .eq("module_number", moduleNumber).eq("is_published", true).order("sort_order");
  if (error) throw new Error(`Could not load this lesson's assessment: ${error.message}`);
  type QuestionRecord = { question_id:string; sort_order:number; title:string; prompt:string; options:unknown; hints:unknown; marks:number };
  const questions = ((questionRows || []) as QuestionRecord[]).map(q => ({
    question_id: q.question_id, sort_order: q.sort_order, title: q.title, prompt: q.prompt,
    options: q.options as string[], hints: q.hints as string[], marks: q.marks,
  }));
  const meta = catalog.modules.find(m => m.id === moduleNumber);
  return <ModulePlayer moduleNumber={moduleNumber} title={moduleRow.title} objective={moduleRow.objective || meta?.objective || ""} questions={questions} />;
}
