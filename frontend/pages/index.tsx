import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head';
import Menu from "@/components/Meet/Menu";
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
     <Head>
      <title>BlocksMeet</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className='main'>
      <Menu />
    </main>
    </>
  )
}