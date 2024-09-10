import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/themeProvider";
import cn from "@/utils/cn";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import { ReactqueryClientProvider } from "@/providers/ReactQueryClientProvider";
import Navbar from "@/components/Navbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContextProvider } from "@/providers/ToastProvider";
import ToastList from "@/components/ToastList";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leave Tracker",
  description: "Leave Tracker for PNA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if the current route is the login page

  return (
    <ReactqueryClientProvider>
      <html suppressHydrationWarning lang="en">
        <body className={cn(inter.className, `text-darker dark:text-white`)}>
          <ToastContextProvider>
            <ThemeProvider>
              <div className="flex h-screen w-full flex-col md:flex-row">
                <Navbar />
                <div className="h-screen w-full overflow-y-auto overflow-x-hidden">
                  {children}
                </div>
                <ToastList />
              </div>
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </ToastContextProvider>
        </body>
      </html>
    </ReactqueryClientProvider>
  );
}
