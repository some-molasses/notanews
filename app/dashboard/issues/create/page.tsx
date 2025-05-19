import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./create-issue.scss";
import { fetchApi } from "@/app/utils/queries";
import { Column } from "@/app/components/layout/layout-components";
import { Button } from "@/app/components/button/button.server";
import { createIssueAction } from "./actions";

// @todo move this to a modal
export default async function CreateIssueView() {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  return (
    <div id="create-issue-page">
      <PageTitle>create new issue</PageTitle>
      <section>
        <form>
          <Column>
            <label htmlFor="issue_name">issue name:</label>
            <input name="issue_name" />

            <label htmlFor="deadline">submission deadline:</label>
            <input type="datetime-local" name="deadline" />

            <Button handler={createIssueAction}>Create issue</Button>
          </Column>
        </form>
      </section>
    </div>
  );
}
