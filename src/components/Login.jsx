import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', form);
            console.log('User Login:', res.data);
            if (res?.data?.message === "Login successful") {
                localStorage.setItem('token', res.data.token);
                navigate('/home');
            }

        } catch (err) {
            console.error('Login Error:', err.response?.data || err.message);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-red-100 to-yellow-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-4">
                <h2 className="text-3xl font-bold text-center text-[#691A1E] mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#E31837] text-white font-semibold py-3 rounded-md hover:bg-[#c7152c] transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#E31837] font-medium hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
