import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            console.log('User Registered:', res.data);
        } catch (err) {
            console.error('Registration Error:', err.response?.data || err.message);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-pink-100 to-red-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-4">
                <h2 className="text-3xl font-bold text-center text-[#691A1E] mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#E31837] text-white font-semibold py-3 rounded-md hover:bg-[#c7152c] transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#E31837] font-medium hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
