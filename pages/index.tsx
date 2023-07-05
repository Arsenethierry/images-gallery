import { getSession } from "next-auth/react"
import axios from 'axios'
import HomePage from '@/components/home-page'
import { GetServerSidePropsContext } from 'next'
import { ImagesDataType } from '@/lib/types'

type PageProps = {
  data: ImagesDataType
}

export default function Home({ data }: PageProps) {
  return <HomePage imagesData={data.images} totalPages={data.totalPages} />
}

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