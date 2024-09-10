import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import SettingsPage from "@/components/main/SettingsPage";


export default async function Home() {
  const { getUser, getPermission } = getKindeServerSession();

  const user = await getUser();

  const permission = await getPermission("is:admin");
  if (!user || !permission?.isGranted) {
    redirect("/not-found");
  }

  return <SettingsPage />;
}
