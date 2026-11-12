import NavHeader from "./navheader";
import CreateAudioBookForm from "./CreateAudioBookForm";
import requireAuth from "@/lib/requireAuth";

type CreatePageProps = {
  searchParams: Promise<{ bookId?: string | string[] }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  await requireAuth();
  const params = await searchParams;
  const bookId = Array.isArray(params.bookId) ? params.bookId[0] : params.bookId;

  return (
    <div className="w-full flex flex-col">
      <NavHeader />
      <CreateAudioBookForm initialBookId={bookId} />
    </div>
  );
}
