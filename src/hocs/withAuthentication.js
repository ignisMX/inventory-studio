import React, { useState } from 'react';
import { useAuthPost } from '@hooks/usePost';
export const withAuthentication = (WrappedComponent) => (props) => {
    const endpoint = {
        auth: process.env.NEXT_PUBLIC_AUTH,
    };

    const credentials = {
        client: process.env.NEXT_PUBLIC_CLIENT,
        secret: process.env.NEXT_PUBLIC_SECRET,
    };

    const [userAccount, setUserAccount] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (event) => {
        setUserAccount({
            ...userAccount,
            [event.target.name]: event.target.value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const response = await useAuthPost(endpoint.auth, credentials, userAccount);
        const { access_token, token_type, refresh_token, expires_in, scope, jti } = { ...response };
        document.cookie = `access_token=${access_token};`;
        document.cookie = `refresh_token=${refresh_token}`;
    };

    const authenticationProps = {
        userAccount,
        handleFormSubmit,
        handleInputChange,
    };

    return <WrappedComponent {...authenticationProps} />;
};
