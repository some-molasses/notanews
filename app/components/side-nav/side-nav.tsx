import { signOut } from "@/app/login/actions";
import "./side-nav.scss";
import Link from "next/link";
import { TITLE_FONT } from "@/app/layout";

export const SideNav: React.FC<{}> = () => {
  return (
    <div className="side-nav-container">
      <Link href={"/dashboard"}>
        <div className={`logo ${TITLE_FONT.className}`}>notanews</div>
      </Link>
      <div id="upper-menu">
        <Link href="/dashboard">articles</Link>
        <Link href="/dashboard/issues">issues</Link>
        <Link href="/dashboard/papers">papers</Link>
      </div>
      <form>
        <button formAction={signOut}>sign out</button>
      </form>
    </div>
  );
};
