import { PropsWithChildren } from "react";
import NavBar from "./components/NavBar";
import ContentLayout from "./components/ContentLayoyt";

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col gap-4 ">
      <NavBar />
      <ContentLayout>
        <div className="max-w-7xl mx-auto">{children}</div>
      </ContentLayout>
    </main>
  );
}
