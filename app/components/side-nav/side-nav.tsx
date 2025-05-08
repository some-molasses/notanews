import { signOut } from "@/app/login/actions";
import "./side-nav.scss";

export const SideNav: React.FC<{}> = () => {
  return (
    <div className="side-nav-container">
      <div className="logo">not a n*ws</div>
      <form>
        <button formAction={signOut}>sign out</button>
      </form>
    </div>
  );
};
