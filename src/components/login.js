import React, { useState } from 'react';
import { auth, googleProvider } from '../config/firebase'; // อัปเดตเส้นทางการนำเข้า

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await auth.signInWithEmailAndPassword(email, password);
            alert('Login successful');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await auth.signInWithPopup(googleProvider);
            alert('Login with Google successful');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            <button type="button" onClick={handleGoogleLogin}>Login with Google</button>
        </form>
    );
};

export default Login;
