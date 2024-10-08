import Button from "@/components/Button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
function LoginPage() {
  return (
    <div className="dark:bg-darkest m-auto flex h-screen w-full flex-col items-center justify-center bg-light">
      <div className="flex w-72 flex-col space-y-5 rounded-md border bg-slate-50 px-4 py-8 shadow-xl dark:border-0 dark:bg-darker dark:text-light sm:w-80">
        <h1 className="text-center text-xl">Welcome! Login to continue 😊</h1>
        <div className="w-full">
          <LoginLink className="w-full" tabIndex={-1}>
            <Button className="w-full">Sign in</Button>
          </LoginLink>
        </div>
        <div className="w-full">
          <p>Don't have an account yet?</p>
          <RegisterLink className="w-full" tabIndex={-1}>
            <Button className="w-full">Sign up</Button>
          </RegisterLink>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
