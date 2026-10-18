import { Halaman } from "@/components/app/Halaman";
import { LamaranSaya } from "@/components/pencari/LamaranSaya";

export const metadata = { title: "Lamaranku" };

export default function Lamaran() {
  return (
    <Halaman>
      <LamaranSaya />
    </Halaman>
  );
}
