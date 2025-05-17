import { signOut } from "@/app/login/actions";
import "./side-nav.scss";
import Link from "next/link";
import { TITLE_FONT } from "@/app/styles";
import { UserProfile } from "./components/user-email";

export function SideNav() {
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
