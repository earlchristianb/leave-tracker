"use client";
import Button from "@/components/Button";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";

export default function Home() {
  const { isAuthenticated, accessTokenEncoded, getUser } =
    useKindeBrowserClient();

  const user = getUser();
  console.log({ isAuthenticated, accessTokenEncoded, user });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <ThemeSwitcher />
        <LogoutLink postLogoutRedirectURL="/login">
          <Button className="text-lg font-bold">Logout</Button>
        </LogoutLink>
      </div>
    </main>
  );
}
