"use server";

import { revalidatePath } from "next/cache";

export const clearDashboardCacheAction = async () => {
  revalidatePath("/dashboard");
};
