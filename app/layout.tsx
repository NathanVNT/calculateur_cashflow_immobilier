import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalyticsConsent from "@/app/GoogleAnalyticsConsent";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Calculateur de rentabilité immobilière",
    description: "Une application simple pour calculer la rentabilité de vos (futurs) investissements immobiliers.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalyticsConsent />
        {children}
        </body>
        </html>
    );
}
