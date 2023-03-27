import "@/styles/globals.css";
import "@/styles/Navbar.css";
import "@/styles/Footer.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Layout from "../components/layout";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flickers</title>
        <meta name="description" content="Flickers" />
      </Head>
      <main className={inter.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </>
  );
}
