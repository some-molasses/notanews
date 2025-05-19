"use server";

import { getJWT } from "@/app/utils/auth-utils";
import { fetchApi } from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export const createIssueAction = async (formData: FormData) => {
  const supabase = await createClient();
  const jwt = await getJWT(supabase);

  if (!formData.has("deadline")) {
    throw new Error("No deadline");
  }
  if (!formData.has("issue_name")) {
    throw new Error("No issue name");
  }
  if (!formData.has("paper_id")) {
    throw new Error("No paper given");
  }

  const issueName = formData.get("issue_name");
  const paper: string = formData.get("paper_id")!.toString();
  const deadlineStr: string = formData.get("deadline")!.toString();

  const deadline: Date = new Date(deadlineStr);

  if (deadline <= new Date()) {
    throw new Error("Issue submission deadline is in the past");
  }

  await fetchApi("issues/create", jwt, {
    method: "POST",
    body: JSON.stringify({
      issue_name: issueName,
      deadline: deadlineStr,
      paper_id: paper,
    }),
    headers: { "Content-Type": "application/json" },
  });

  redirect(`/dashboard/papers/${paper}`);
};
