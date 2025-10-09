'use client'

import Image from "next/image";
import { useState } from "react";
import styles from "./register.module.css";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { toast } from "react-toastify";
import Link from "next/link";
import { register } from "@/lib/api/auth";

interface LoginForm {
    name: string;
    email: string;
    password: string;
}

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [formData, setFormData] = useState<LoginForm>({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.name) {
        toast.error("Please fill in all fields.");
        return;
    }

    setLoading(true);

    try {
        const res = await register(formData.name, formData.email, formData.password);

        // Nếu response có statusCode 201 => thành công
        if (res?.statusCode === 201) {
            toast.success("Registered successfully!");
            setTimeout(() => router.replace("/"), 1500);
        } else {
            // Nếu backend trả về status khác (nhưng không throw)
            toast.error(res?.message || "Registration failed.");
        }
    } catch (err: unknown) {
      let errorMsg = "An error occurred during register";
      if (err instanceof Error) errorMsg = err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
};


    return (
        <div className={styles.pageContainer}>
            <div className={styles.left}>
                <Image
                    src="https://www.investopedia.com/thmb/kVxMl1DFogJNwnjMJv6zNxmuU6c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-618432992-a6784667528e4771bf8a69477a149d05.jpg"
                    alt="Login"
                    fill
                    className={styles.leftImage}
                />
            </div>
            <div className={styles.right}>
                <div className={styles.loginBox}>
                    <h2 className={styles.title}>Sign Up</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">name</label>
                            <input
                                type="text"
                                id="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={styles.input}
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.button}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Register"}
                        </button>
                    </form>
                    <p className={styles.link}>
                        Have an account? <Link href="/">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}