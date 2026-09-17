import { Button } from "@/components/ui/button";
import ContentLayout from "./ContentLayoyt";
import { Headphones } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className=" py-5 border-b ">
      <ContentLayout>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="rounded-full flex items-center justify-center w-9 h-9 bg-primary">
              <Headphones size={18} />
            </Avatar>
            <h2 className="text-xl font-medium  font-display">StoryVoice</h2>
          </div>
          <div className="flex gap-2">
            <Link href="/library" prefetch>
              <Button variant={"ghost"}>Explore Demo</Button>
            </Link>
            <Link href="/create" prefetch>
              <Button>Create Audiobook</Button>
            </Link>
          </div>
        </div>
      </ContentLayout>
    </nav>
  );
}
