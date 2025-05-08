import { signOut } from "@/app/login/actions";
import "./side-nav.scss";
import Link from "next/link";

export const SideNav: React.FC<{}> = () => {
  return (
    <div className="side-nav-container">
      <Link href={"/dashboard"}>
        <div className="logo">not a n*ws</div>
      </Link>
      <form>
        <button formAction={signOut}>sign out</button>
      </form>
    </div>
  );
};
