"use client";

import { Table } from "@/app/components/table/table";
import { PaperMemberDetailed } from "@/app/utils/data-types";
import React from "react";
import { updateRole } from "../queries";
import { toast } from "react-toastify";
import { useJWT } from "@/app/auth/components/jwt-context";

export const PaperMembersTable: React.FC<{
  paperMembers: PaperMemberDetailed[];
}> = ({ paperMembers }) => {
  const jwt = useJWT();

  if (!jwt) {
    return null;
  }

  return (
    <Table
      headers={["member", "role"]}
      data={paperMembers}
      rowGenerator={(member) => makeMemberRow(member, jwt)}
    />
  );
};

const makeMemberRow = (paperMember: PaperMemberDetailed, jwt: string) => {
  return (
    <tr key={paperMember.id}>
      <td>
        <div className="cell">{paperMember.email}</div>
      </td>
      <td>
        <div className="cell">
          <select
            className="role-select"
            defaultValue={paperMember.type}
            onChange={(event) => {
              updateRole(event.target.value, paperMember.id, jwt).then(() =>
                toast(
                  `Successfully updated ${paperMember.email}'s role to ${event.target.value}!`,
                ),
              );
            }}
          >
            {["contributor", "editor"].map((role) => (
              <option value={role} key={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </td>
    </tr>
  );
};
