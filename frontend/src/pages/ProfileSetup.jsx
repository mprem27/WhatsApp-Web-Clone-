import React, { useRef, useState } from "react";
import { Assets } from "../assets/Assets";
import { completeProfile } from "../services/userService";

function ProfileSetup({ onProfileComplete }) {
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(Assets.profile);
  const [profileFile, setProfileFile] = useState(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setProfileFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleFinish = async () => {
    if (!username.trim() || !fullName.trim()) {
      setError("Username and full name are required to continue.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("fullName", fullName.trim());

      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      const data = await completeProfile(formData);

      onProfileComplete?.(data.user);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Profile setup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden bg-orange-100 text-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide text-gray-950">
            Profile
          </h1>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={handleImageClick}
            className="rounded-full bg-gray-200 p-1.5 transition hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <img
              src={profileImage}
              alt="User profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <p className="mt-2 text-center text-xs font-medium text-gray-700">
            Click the profile image to change your photo.
          </p>
        </div>

        <form className="mt-9 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              placeholder="username"
              className="mt-1 w-full border-b border-orange-300 bg-transparent py-2 text-base font-semibold text-gray-950 placeholder:font-medium placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
            />

            <p className="mt-1 text-xs font-medium text-gray-700">
              Must be unique. Duplicate usernames are not allowed.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setError("");
              }}
              placeholder="your full name"
              className="mt-1 w-full border-b border-orange-300 bg-transparent py-2 text-base font-semibold text-gray-950 placeholder:font-medium placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </form>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p
            className={`text-xs font-semibold ${
              error ? "text-red-500" : "text-gray-700"
            }`}
          >
            {error || "Username and full name are required."}
          </p>

          <button
            type="button"
            onClick={handleFinish}
            disabled={loading}
            className="shrink-0 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Finish"}
          </button>
        </div>
      </main>

      <footer className="pb-3 text-center text-xs font-medium text-gray-600">
        © 2026 WhatsApp Web Clone. All rights reserved.
      </footer>
    </div>
  );
}

export default ProfileSetup;