// import { getServerSession } from 'next-auth/next'
// import { Inter } from 'next/font/google'
import { jsonData } from '@/data'
import { authOptions } from './api/auth/[...nextauth]'

// const inter = Inter({ subsets: ['latin'] })

// export default function Home() {
  
//   return (
//     <main
//       className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
//     >
//       <h1>Home</h1>
//         <h1>Server Side Rendered</h1>
//         {/* <pre>{JSON.stringify(session)}</pre> */}
//         {/* <h1>Client Side Rendered</h1> */}
//     </main>
//   )
// }


// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res, authOptions)

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/auth/login',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {
//       session,
//     },
//   }
// }

import { getServerSession } from "next-auth"
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import axios from 'axios'
import HomePage from '@/components/home-page'
import { GetServerSidePropsContext } from 'next'
import { ImagesDataType } from '@/lib/types'

type PageProps = {
  data: ImagesDataType
}

export default function Home({ data }: PageProps) {
  return <HomePage imagesData={data} />
  // const { data: session } = useSession()
  // if(session) {
  //   return <>
  //   Dummy json length: { JSON.stringify(imagesData.data)}
  //     Signed in as {session.user.email} <br/>
  //     <button onClick={() => signOut()}>Sign out</button>
  //   </>
  // }
  // return <>
  // Dummy json length: { JSON.stringify(imagesData.data)}
  //   Not signed in <br/>
  //   <button onClick={() => signIn()}>Sign in</button>
  // </>
}

// export async function getServerSideProps(context) {
//   const { data } = await axios.get('http://localhost:3000/api/images');
//   const session = await getServerSession(context.req, context.res, authOptions)
//   console.log("server session: " , session)
//   return {
//     props: {
//       imagesData: { data },
//     },
//   }
// }

export async function getServerSideProps (context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images`);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      data
    },
  };
};