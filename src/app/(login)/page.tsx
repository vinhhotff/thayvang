// components/Login.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/Context/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/products");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(formData.email, formData.password);
      console.log("API Response:", data);
      if (data?.statusCode === 201 || data?.statusCode === 200) {
        toast.success(data.message || "Login successful!");
        setTimeout(() => router.replace("/products"), 1500);
      } else {
        toast.info(data?.message || "Login process completed with issues.");
      }
    } catch (err: unknown) {
      let errorMsg = "An error occurred during login";
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
          src="https://imageio.forbes.com/specials-images/imageserve/638a98b6a088e5ce47202972/Girls-carrying-shopping-bags/960x0.jpg?format=jpg&width=960"
          alt="Shopping Girls"
          fill
          className={styles.leftImage}
          priority
        />
      </div>
      <div className={styles.right}>
        <div className={styles.loginBox}>
          <h2 className={styles.title}>Sign In</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
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
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className={styles.link}>
            Don’t have an account? <Link href="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}