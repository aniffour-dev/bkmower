import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/global/header/Navbar";
import Footer from "@/app/components/global/footer/Footer";
import { MyProvider } from "@/context/DynamicContext";
// import ProgressBar from "@/app/ProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BKMower",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <MyProvider>
          {/* <ProgressBar /> */}
          <Navbar />
          {children}
          <Footer />
        </MyProvider>
      </body>
    </html>
  );
}