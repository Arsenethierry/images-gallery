import AuthPage from '@/components/auth-page';
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