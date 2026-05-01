import React, { useState } from "react";
import { Assets } from "../assets/Assets";
import { accessUser } from "../services/authService";

function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showAccessGuide = () => {
    setIsLogin(false);
    setShowGuide(true);
    setError("");
  };

  const showLoginForm = () => {
    setIsLogin(true);
    setShowGuide(false);
    setError("");
  };

  const handleAccess = async (event) => {
    event.preventDefault();

    if (!emailOrUsername.trim() || !password.trim()) {
      setError("Email/username and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await accessUser({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      onAuthSuccess?.(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to access account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Fixed Background */}
      <div className="fixed left-0 top-0 h-[50vh] w-full bg-orange-200" />
      <div className="fixed bottom-0 left-0 h-[50vh] w-full bg-white" />

      {/* Scrollable Content */}
      <div className="relative z-10 h-screen overflow-y-auto px-4">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col items-center pb-24 pt-12">
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-4">
            <img
              src={Assets.logo}
              alt="WhatsApp Web Clone"
              className="h-16 w-16 object-contain"
            />

            <h1 className="text-3xl font-bold tracking-wide text-black md:text-4xl">
              WhatsApp Web Clone
            </h1>
          </div>

          {/* Info Section */}
          <div className="mt-6 max-w-2xl text-center">
            <p className="text-base text-gray-800 md:text-lg">
              {isLogin
                ? "Login with your email or username to continue your conversations."
                : "New users can start with basic account access and complete their profile inside the app."}
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {isLogin
                ? "If the account does not exist, access will be created and profile setup will continue next."
                : "Profile details such as full name, username, and photo are completed after account access."}
            </p>
          </div>

          {/* Auth Card */}
          <main className="mt-12 flex w-full max-w-md justify-center">
            <div className="w-full rounded-2xl bg-white p-8 shadow-2xl">
              <h2 className="mb-2 text-center text-2xl font-semibold text-black">
                {isLogin ? "Account Access" : "Account Access Guide"}
              </h2>

              <p className="mb-6 text-center text-sm text-gray-600">
                {isLogin
                  ? "Enter your details to login or start setup"
                  : "How new users enter and complete setup"}
              </p>

              {showGuide ? (
                <div className="rounded-xl bg-orange-50 px-5 py-5 text-sm text-gray-700">
                  <p>
                    This app uses a single access flow. Existing users will log
                    in directly. New users can enter email or username with a
                    password to start account access, then complete their
                    profile after entering the app.
                  </p>

                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    <li>Use email or username with a secure password.</li>
                    <li>
                      Existing accounts open the chat dashboard after login.
                    </li>
                    <li>
                      New accounts continue to profile setup before chatting.
                    </li>
                    <li>
                      Username, full name, and profile photo are completed in
                      the profile step.
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={showLoginForm}
                    className="mt-5 w-full rounded-xl bg-orange-400 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-orange-500"
                  >
                    Back to Access
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleAccess}>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={(event) => {
                        setEmailOrUsername(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter email or username"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black transition focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black transition focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-medium text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-orange-400 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Please wait..." : "Continue"}
                  </button>
                </form>
              )}

              {/* Bottom Navigation */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-700">
                  {isLogin ? "New to this app?" : "Already have access?"}{" "}
                  <button
                    type="button"
                    onClick={isLogin ? showAccessGuide : showLoginForm}
                    className="ml-1 font-semibold text-orange-500 hover:underline"
                  >
                    {isLogin ? "View account guide" : "Login"}
                  </button>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 z-20 w-full bg-white py-4 text-center text-sm text-gray-600">
        © 2026 WhatsApp Web Clone. All rights reserved.
      </footer>
    </div>
  );
}

export default AuthPage;
