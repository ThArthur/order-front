import Image from "next/image";
import styles from "./page.module.css";
import SideMenu from "@/components/SideMenu";

export default function Home() {
  return (
    <div>
      <main>
        <SideMenu />
      </main>
    </div>
  );
}
