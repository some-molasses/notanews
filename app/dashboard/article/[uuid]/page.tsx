import { Row } from "@/app/components/layout/layout-components";
import { redirectIfNotLoggedIn } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import React from "react";

export default async function ArticleEditor({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const supabase = await createClient();
  await redirectIfNotLoggedIn(supabase);

  return (
    <>
      <Row className="title-row">
        <h1>Article {(await params).uuid}</h1>
      </Row>
    </>
  );
}
