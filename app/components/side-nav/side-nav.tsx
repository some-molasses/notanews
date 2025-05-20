"use server";

import { signOut } from "@/app/login/actions";
import "./side-nav.scss";
import Link from "next/link";
import { TITLE_FONT } from "@/app/styles";
import { UserProfile } from "./components/user-email";
import { isEditor } from "@/app/utils/queries";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";

export async function SideNav() {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);
  const amIEditor: boolean = await isEditor(jwt);

  return (
    <div className="side-nav-container">
      <Link href={"/dashboard"}>
        <div className={`logo ${TITLE_FONT.className}`}>notanews</div>
      </Link>
      <div id="upper-menu">
        <Link href="/dashboard" className="menu-button">
          <span>articles</span>
        </Link>
        <Link href="/dashboard/papers" className="menu-button">
          <span>papers</span>
        </Link>
        {amIEditor ? (
          <>
            <br />
            <Link href="/dashboard/editing" className="menu-button">
              <span>editing</span>
            </Link>
          </>
        ) : null}
        <form>
          <button formAction={signOut} className="menu-button">
            <span>sign out</span>
          </button>
        </form>
      </div>
      <UserProfile />
    </div>
  );
}
