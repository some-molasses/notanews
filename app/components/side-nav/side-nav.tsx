import { signOut } from "@/app/login/actions";
import "./side-nav.scss";
import Link from "next/link";
import { TITLE_FONT } from "@/app/styles";
import { UserEmail } from "./components/user-email";

export function SideNav() {
  return (
    <div className="side-nav-container">
      <Link href={"/dashboard"}>
        <div className={`logo ${TITLE_FONT.className}`}>notanews</div>
      </Link>
      <div id="upper-menu">
        <Link href="/dashboard">
          <span>articles</span>
        </Link>
        <Link href="/dashboard/papers">
          <span>papers</span>
        </Link>
      </div>
      <UserEmail />
      <form>
        <button formAction={signOut}>sign out</button>
      </form>
    </div>
  );
}
