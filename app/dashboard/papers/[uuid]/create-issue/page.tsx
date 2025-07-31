import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./create-issue.scss";
import { fetchApi, getPaperById } from "@/app/utils/queries";
import { Column } from "@/app/components/layout/layout-components";
import { Button } from "@/app/components/button/button.server";
import { createIssueAction } from "./actions";
import { PageContainer } from "@/app/components/page-container/page-container";

// @todo move this to a modal
export default async function CreateIssueView({
  params,
}: {
  params: { uuid: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const paper = await getPaperById(params.uuid, jwt);

  return (
    <PageContainer id="create-issue-page">
      <PageTitle>create new {paper.name} issue</PageTitle>
      <section>
        <form>
          <Column id="issue-form-col">
            <Column>
              <label htmlFor="issue_name">issue name:</label>
              <input name="issue_name" />
            </Column>

            <Column>
              <label htmlFor="deadline">submission deadline (UTC):</label>
              <input
                type="datetime-local"
                name="deadline"
                min={new Date().toISOString().slice(0, 16)}
              />
            </Column>

            <input
              type="hidden"
              name="paper_id"
              value={(await params).uuid}
              style={{ display: "none" }}
            />

            <Button handler={createIssueAction}>Create issue</Button>
          </Column>
        </form>
      </section>
    </PageContainer>
  );
}
