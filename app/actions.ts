'use server'

import { revalidatePath } from "next/cache"

export async function revalidateNav(route: string) {
    revalidatePath(route);
}