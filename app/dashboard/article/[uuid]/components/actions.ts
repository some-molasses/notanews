"use server";

import { revalidatePath } from "next/cache";

export const clearDashboardCacheAction = () => {
  // @ts-expect-error layout unexpected
  revalidatePath("/dashboard", "layout");
};
