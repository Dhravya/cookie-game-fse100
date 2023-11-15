import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div
        style={{
          // Repeating bg.jpeg 
          backgroundImage: `url('/bg.jpeg')`,
          backgroundSize: "cover"
        }}
      className={`font-sans ${inter.variable}`}>{children}</div>
  );
}
