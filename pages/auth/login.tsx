import AuthPage from '@/components/auth-page';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next"
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

function Login() {
    return (
        <div>
            <AuthPage isNewUser={false} />
        </div>
    );
}

export default Login;
Login.WithOwnLayout = true;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context);
    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};
