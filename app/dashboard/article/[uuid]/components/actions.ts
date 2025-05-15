"use server";

import { revalidatePath } from "next/cache";

export const clearDashboardCacheAction = () => {
  revalidatePath("/dashboard");
};
