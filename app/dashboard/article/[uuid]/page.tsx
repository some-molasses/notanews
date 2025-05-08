import { Row } from "@/app/components/layout/layout-components";
import React from "react";

export default async function ArticleEditor({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  return (
    <>
      <Row className="title-row">
        <h1>Article {(await params).uuid}</h1>
      </Row>
    </>
  );
}
