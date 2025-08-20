import React, { useState, useContext, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthProvider, { AuthContext } from "../provider/AuthProvider";
import type { AuthContextType } from "../provider/AuthProvider";

const SignUp: React.FC = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const [nameError, setNameError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  if (!authContext) return null; // Safety fallback

  const { createUser, setUser, updateUser } = authContext;

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (name.length < 5) {
      setNameError("Name should be more than 5 characters");
      return;
    } else {
      setNameError("");
    }

    try {
      // 1. Create user in Firebase
      const currentUser = await createUser(email, password);
      const newUser = currentUser.user;

      await updateUser({ displayName: name });
      setUser({ ...newUser, displayName: name });

      toast.success("Register Success!");

      // 3. Post to local backend /users
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("User saved to backend:", data);

      navigate("/");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Registration failed!");
      console.error("SignUp Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 pb-20 lg:pt-5">
      <ToastContainer />
      <div className="bg-base-100 border border-base-300 shadow-xl rounded-2xl p-8 w-full max-w-sm text-base-content">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full"
              required
              minLength={5}
            />
            {nameError && (
              <p className="text-xs text-error mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full pr-10"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="At least 8 characters, with uppercase, lowercase, and number"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-500"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/sign-in" className="link text-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
