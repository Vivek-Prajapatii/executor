export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

export default function Page() {
  const timeStamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  redirect(`/javascript/${timeStamp}${randomString}`);
}
