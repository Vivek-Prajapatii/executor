import { redirect } from "next/navigation";

export default function Page() {
    const timeStamp = new Date().getTime();
  redirect(`/javascript/${timeStamp}`);
}
