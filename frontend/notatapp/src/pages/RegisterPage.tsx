import React, { useEffect, useState } from 'react'
import "../styling/RegisterPage.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserService } from '../services/UserService';

const RegisterPage = (() => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try{
            await UserService.register(email, password);
            navigate("/login")
        } catch (err){
            setError("Email is already taken")
        }
    }

    useEffect(() => {
        console.log("Register page error: ", error)
    }, [error])

    return (
        <div className='register-page-wrapper'>
                <form onSubmit={handleSubmit} className='register-page-form-wrapper'>
                    <h1>Register</h1>
                    <div className='register-page-email-wrapper'>
                        <label>Email</label>
                        <input 
                        type='text' 
                        className='register-page-email-input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='register-page-password-wrapper'>
                        <label>Password</label>
                        <input 
                        type='password' 
                        className='register-page-password-input'
                        onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Link to="/login">Already have an account?</Link>
                    <button type='submit' className='register-page-submit-button'>Register</button>
                </form>

        </div>
    )
})

export default RegisterPage