import AuthPage from '@/components/auth-page';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next"

function Login() {
    return (
        <div>
            <AuthPage  isNewUser={false} />
        </div>
    );
}

export default Login;
Login.WithOwnLayout = true;
