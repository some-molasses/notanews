import { Button } from "../components/button/button.server";
import { Column, Row } from "../components/layout/layout-components";
import { TITLE_FONT } from "../layout";
import { login, signup } from "./actions";
import "./login.scss";

export default async function LoginPage() {
  return (
    <div id="outer-space">
      <div id="inner-content">
        <h1 className={TITLE_FONT.className}>notanews</h1>
        <form>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="email address"
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="password"
          />
          <Column className="buttons">
            <Button handler={login}>Log in</Button>
            <Button handler={signup}>Sign up</Button>
          </Column>
        </form>
      </div>
    </div>
  );
}
