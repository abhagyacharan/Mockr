"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
}: AuthModalProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (mode === "signup") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const endpoint =
        mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload = {
        email: formData.email,
        password: formData.password,
        ...(mode === "signup" && {
          first_name: formData.firstName,
          last_name: formData.lastName,
        }),
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      if (mode === "signup" && !data.access_token) {
        setMode("login");
        setErrors({ general: "Account created. Please log in." });
        setIsLoading(false);
        return;
      }

      const token = data.access_token;
      const user = data.user || {
        id: "user-" + Date.now(),
        name:
          `${formData.firstName} ${formData.lastName}`.trim() ||
          formData.email.split("@")[0],
        email: formData.email,
      };

      login(token, user);
      onClose();
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 50);
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md mx-4 backdrop-blur-md bg-white/95 border-white/20 shadow-2xl rounded-lg border"
          >
            <div className="relative p-6">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title */}
              <motion.h2
                className="text-2xl font-semibold text-center mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </motion.h2>

              {/* Mode Switcher */}
              <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-2">
                <button
                  className={`flex-1 py-2 px-4 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                    mode === "login"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                    mode === "signup"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form */}
            <motion.div
              className="px-6 pb-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Signup name fields */}
                {mode === "signup" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["firstName", "lastName"].map((field, idx) => (
                      <motion.div
                        key={field}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="space-y-2"
                      >
                        <label htmlFor={field} className="text-sm font-medium">
                          {field === "firstName" ? "First Name" : "Last Name"}
                        </label>
                        <input
                          id={field}
                          type="text"
                          placeholder={
                            field === "firstName" ? "First Name" : "Last Name"
                          }
                          value={(formData as any)[field]}
                          onChange={(e) =>
                            handleInputChange(field, e.target.value)
                          }
                          className={`w-full h-10 rounded-sm border px-3 py-2 text-sm ${
                            errors[field] ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors[field] && (
                          <p className="text-sm text-red-500">
                            {errors[field]}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Email Field */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="space-y-2"
                >
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full h-10 rounded-sm border px-3 py-2 text-sm ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="space-y-2"
                >
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full h-10 rounded-sm border px-3 py-2 text-sm ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </motion.div>

                {/* Confirm Password (signup only) */}
                {mode === "signup" && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="space-y-2"
                  >
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className={`w-full h-10 rounded-sm border px-3 py-2 text-sm ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* General Error */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-sm"
                  >
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full inline-flex items-center justify-center cursor-pointer rounded-sm text-sm font-medium bg-blue-600 text-white h-10 px-4 py-2 hover:bg-blue-700 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === "login"
                        ? "Signing In..."
                        : "Creating Account..."}
                    </>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
