"use client";

import { Slide, ToastContainer } from "react-toastify";
import { BODY_FONT } from "../styles";

/**
 * Things that should be on every page, but have to be client-side
 */

export const ClientLayout = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        closeOnClick={true}
        theme="light"
        transition={Slide}
        toastClassName={BODY_FONT.className}
      />
    </>
  );
};
