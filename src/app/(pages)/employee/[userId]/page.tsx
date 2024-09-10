import EmployeePage from "@/components/main/EmployeePage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
async function Employee({ params }: { params: { userId: string } }) {
  const { getUser, getPermission } = getKindeServerSession();
  const user = await getUser();
  const permission = await getPermission("is:admin");
  if (!user || !permission?.isGranted || !params.userId) {
    redirect("/not-found");
  }
  return <EmployeePage userId={params.userId} />;
}

export default Employee;
