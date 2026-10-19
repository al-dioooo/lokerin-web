import { Suspense } from "react";
import { Halaman } from "@/components/app/Halaman";
import { EditorCv } from "@/components/pencari/EditorCv";

export const metadata = { title: "CV lamaran" };

export default function Cv({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main id="utama" className="min-h-dvh bg-kertas px-4 pt-6 sm:px-6">
      <Halaman>
      <Suspense fallback={<p className="py-10 text-center text-abu" role="status">Memuat CV...</p>}>
        <EditorDariAlamat params={params} />
      </Suspense>
      </Halaman>
    </main>
  );
}

async function EditorDariAlamat({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditorCv id={id} />;
}
