import NavHeader from "./navheader";
import CreateAudioBookForm from "./CreateAudioBookForm";
import requireAuth from "@/lib/requireAuth";

export default async function CreatePage() {
  await requireAuth();
  return (
    <div className="w-full flex flex-col">
      <NavHeader />
      <CreateAudioBookForm />
    </div>
  );
}
