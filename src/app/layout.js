import "./globals.css";
import SideMenu from "@/components/SideMenu/SideMenu";
import {Roboto} from "@next/font/google";


export const metadata = {
  title: "Desafio - Techno",
  description: "Desafio Dev Pleno - Techno",
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700']
})

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR" className={roboto.className}>
          <body>
            <SideMenu/>
            <main style={{display: "flex", flexDirection: "column", flex: 1, padding: '2rem'}}>
              {children}
            </main>
          </body>
        </html>
    );
}