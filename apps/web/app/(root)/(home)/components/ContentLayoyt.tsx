import { PropsWithChildren } from "react";

export default function ContentLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-6 md:px-8">
      {children}
    </div>
  );
}
