import React, { useEffect, useState } from 'react'
import "../styling/LoginPage.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserService } from '../services/UserService';

const LoginPage = (() => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        try{
          const { token } = await UserService.login(email, password);
          localStorage.setItem("token", token);
          navigate("/notes");
        } catch (err){
          setError("Invalid email or password");
        }
    }

    useEffect(() => {
        console.log("Login page error: ", error)
    }, [error])

    return (
        <div className='login-page-wrapper'>
                <form onSubmit={handleSubmit} className='login-page-form-wrapper'>
                    <h1>Login</h1>
                    <div className='login-page-email-wrapper'>
                        <label>Email</label>
                        <input 
                        type='text' 
                        className='login-page-email-input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='login-page-password-wrapper'>
                        <label>Password</label>
                        <input 
                        type='password' 
                        className='login-page-password-input'
                        onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Link to="/register">Register account?</Link>
                    <button type='submit' className='login-page-submit-button'>Login</button>
                </form>

        </div>
    )
})

export default LoginPage