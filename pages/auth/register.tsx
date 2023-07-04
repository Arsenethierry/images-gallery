import AuthPage from '@/components/auth-page';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';

function Register() {
    return (
        <div>
            <AuthPage isNewUser={true} />
        </div>
    );
}

export default Register;
Register.WithOwnLayout = true;

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