import { PanggilanDemo } from "@/components/app/PanggilanDemo";

export const metadata = { title: "Ngobrol" };

export default function Ngobrol() {
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-[1.75rem] leading-tight">Ceritakan pengalamanmu. <span className="text-jingga">CV-mu tersusun sambil ngobrol.</span></h1>
        <p className="mt-1 max-w-xl text-sm text-abu">Sebutkan pekerjaan yang pernah kamu lakukan, di mana, dan jam berapa kamu bisa kerja. Setiap jawaban langsung masuk ke CV.</p>
      </div>
      <PanggilanDemo />
    </div>
  );
}
