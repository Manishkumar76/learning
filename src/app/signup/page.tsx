'use client'; // This file is client-side only
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios, { formToJSON } from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { json } from "stream/consumers";
import bg_image from "../assets/images/web_bg.jpg";
import Lottie from "lottie-react";
import loadingAnmimation from "../assets/animation/loading.json";


export default function Signup() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: ""
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false
    });
const [loading, setLoading] = useState(false);
    const validate = () => {
        const newErrors = {
            username: "",
            email: "",
            password: "",
        };

        // Username validation
        if (!user.username) {
            newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9]+$/.test(user.username)) {
            newErrors.username = 'Username must be alphanumeric';
        } else if (user.username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
        }

        // Email validation
        if (!user.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation
        if (!user.password) {
            newErrors.password = 'Password is required';
        } else {
            if (user.password.length < 8) {
                newErrors.password += 'Password must be at least 8 characters. ';
            }
            if (!/[A-Z]/.test(user.password)) {
                newErrors.password += 'Must include at least one uppercase letter. ';
            }
            if (!/[a-z]/.test(user.password)) {
                newErrors.password += 'Must include at least one lowercase letter. ';
            }
            if (!/\d/.test(user.password)) {
                newErrors.password += 'Must include at least one number. ';
            }
            if (!/[@$!%*?&]/.test(user.password)) {
                newErrors.password += 'Must include at least one special character (@$!%*?&). ';
            }
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    useEffect(() => {
        const isValid = validate();
        setButtonDisabled(!isValid);
    }, [user]);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            toast.success("Signup successful", { duration: 5000 });
            console.log("Signup successful", response.data);
            
            router.push("/login"); // Redirect to login page after signup
        } catch (error:any) {
            toast.error(error.error.message, { duration: 5000 });
            
        }finally {
            setLoading(false);
            setButtonDisabled(true);
        }
    };

    const handleBlur = (field:any) => {
        setTouched({ ...touched, [field]: true });
        validate();
    };

    // GSAP Cursor Effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const mousemove = (e:any) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', mousemove);
        return () => window.removeEventListener('mousemove', mousemove);
    }, [mousePosition]);

    useGSAP(() => {
        gsap.to('.cursor', {
            x: mousePosition.x,
            y: mousePosition.y,
            ease: "power2.out",
            duration: 0.3
        });
    }, [mousePosition]);

    return (
        <div className="relative">
              <Toaster position="top-right"  />
            {/* Animated Cursor */}
            <div className="cursor w-6 h-6 rounded-full bg-white fixed z-50 pointer-events-none"></div>
            <div className="h-screen bg-gray-900 flex items-center justify-center relative">
            <img src={bg_image.src} alt="" className="h-screen absolute w-full " />
            {
                    loading &&(<div className="absolute bg-black bg-opacity-50 h-screen w-full z-50 ">
                    <Lottie animationData={loadingAnmimation}  className="w-1/2 h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>)
                }
                <div className="flex flex-col items-center w-96 p-6 rounded-lg bg-gray-600 text-white bg-opacity-30 backdrop-blur">
                    <h1 className="text-xl font-bold mb-4">Signup Page</h1>

                    <input
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 text-black focus:outline-none focus:border-blue-400"
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        onBlur={() => handleBlur('username')}
                    />
                    {touched.username && errors.username && (
                        <div className="text-red-500 text-sm mb-2">{errors.username}</div>
                    )}

                    <input
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 text-black focus:outline-none focus:border-blue-400"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        onBlur={() => handleBlur('email')}
                    />
                    {touched.email && errors.email && (
                        <div className="text-red-500 text-sm mb-2">{errors.email}</div>
                    )}

                    <input
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 text-black focus:outline-none focus:border-blue-400"
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        onBlur={() => handleBlur('password')}
                    />
                    {touched.password && errors.password && (
                        <div className="text-red-500 text-sm mb-2">{errors.password}</div>
                    )}

                    <button
                        disabled={buttonDisabled}
                        className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        onClick={onSignup}
                    >
                        Signup
                    </button>

                    <div className="my-2 py-2">
                        <span>Already have an account? </span>
                        <Link className="text-blue-400 mt-4 hover:underline" href="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}