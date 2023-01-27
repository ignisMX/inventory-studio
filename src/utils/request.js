export const buildFetchOptions = (method, data) => {
    let options = {
        method: method,
        redirect: 'manual',
        mode: 'cors',
        cache: 'default',
    };

    if (method === 'POST' || method === 'PUT') {
        options.body = JSON.stringify(data);
        options.headers = {
            'Content-Type': 'application/json',
            'Access-Control-Expose-Headers': 'Location',
        };
    }

    return options;
};

export const buildAuthOptions = (credentials, data) => {
    const { client, secret } = { ...credentials };
    const { username, password } = { ...data };
    const options = {
        method: 'POST',
        redirect: 'manual',
        mode: 'cors',
        cache: 'default',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: `Basic ${Buffer.from(`${client}:${secret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
            username: username,
            password: password,
            grant_type: 'password',
            scopes: 'read write',
        }),
    };

    return options;
};
