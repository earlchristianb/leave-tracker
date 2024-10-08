import DashboardPage from "@/components/main/DashboardPage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const { getUser, getPermission } = getKindeServerSession();
  const user = await getUser();
  const permission = await getPermission("is:admin");
  if (!user || !permission?.isGranted) {
    redirect("/not-found");
  }
  return <DashboardPage />;
}
