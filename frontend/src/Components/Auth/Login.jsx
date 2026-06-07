import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import host from '../../config';

const Login = () => {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const json = await response.json();

        console.log(json);

        if (json.authtoken) {
            localStorage.setItem('token', json.authtoken);
            navigate('/');
        } else {
            alert(json.error || 'Invalid credentials');
        }
    };

    const onChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className='p-6 max-w-md mx-auto'>
            <h2 className='text-2xl font-bold mb-4'>
                Login
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>

                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={onChange}
                    className='border p-2 rounded w-full'
                />

                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={onChange}
                    className='border p-2 rounded w-full'
                />

                <button
                    type='submit'
                    className='bg-green-500 text-white px-4 py-2 rounded'
                >
                    Login
                </button>

            </form>
        </div>
    );
};

export default Login;