import { PageTitle } from "@/app/components/page-title/page-title";
import { Table } from "@/app/components/table/table";

const IssuesPage = () => {
  return (
    <>
      <PageTitle>my issues</PageTitle>
      <Table
        headers={["name", "organization", "status"]}
        data={[]}
        rowGenerator={() => null}
      />
    </>
  );
};

export default IssuesPage;
