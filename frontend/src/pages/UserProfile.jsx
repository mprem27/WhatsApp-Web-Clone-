import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  AtSign,
  Clock,
} from "lucide-react";
import { Assets } from "../assets/Assets";
import {
  getUserProfile,
  updateUserProfile,
} from "../services/userService";

function UserProfile({ onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    about: "",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();

      if (response?.success && response?.user) {
        setUser(response.user);

        setFormData({
          fullName: response.user.fullName || "",
          about: response.user.about || "",
          profileImage: null,
        });

        setPreviewImage(
          response.user.profileImage || Assets.profile
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch profile:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));

    setPreviewImage(
      URL.createObjectURL(file)
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const submitData = new FormData();

      submitData.append(
        "fullName",
        formData.fullName.trim()
      );

      submitData.append(
        "about",
        formData.about.trim()
      );

      if (formData.profileImage) {
        submitData.append(
          "profileImage",
          formData.profileImage
        );
      }

      const response =
        await updateUserProfile(
          submitData
        );

      if (response?.success) {
        setUser(response.user);

        localStorage.setItem(
          "whatsapp_clone_user",
          JSON.stringify(response.user)
        );

        window.dispatchEvent(
          new Event("profileUpdated")
        );

        setEditing(false);
      }
    } catch (error) {
      console.error(
        "Profile update failed:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="flex h-[calc(100vh-3rem)] flex-1 items-center justify-center bg-orange-50">
        <div className="text-sm font-semibold text-orange-600">
          Loading profile...
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-[calc(100vh-3rem)] flex-1 flex-col bg-orange-50">
      <header className="flex items-center justify-between border-b border-orange-100 bg-[#FFF8F2]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl p-2 text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-xl font-bold text-gray-950">
            My Profile
          </h2>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={() =>
              setEditing(true)
            }
            className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-semibold text-green-600 transition hover:text-green-700"
          >
            {saving
              ? "Saving..."
              : "Save"}
          </button>
        )}
      </header>

      <div className="flex flex-1 justify-center overflow-y-auto px-6 py-8">
        <div className="w-full max-w-4xl space-y-10">
          <div className="rounded-3xl bg-[#FFF8F2] px-10 py-10 shadow-sm">
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
                <img
                  src={previewImage}
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.src =
                      Assets.profile;
                  }}
                  className="h-36 w-36 rounded-full border-4 border-orange-100 bg-gray-200 object-cover shadow-sm"
                />

                {editing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />
                )}
              </label>

              {editing ? (
                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Full Name"
                  className="mt-6 w-full max-w-md border-b-2 border-orange-200 bg-transparent px-3 pb-2 text-center text-3xl font-bold text-gray-950 focus:border-orange-400 focus:outline-none"
                />
              ) : (
                <h3 className="mt-6 text-3xl font-bold text-gray-950">
                  {user.fullName}
                </h3>
              )}

              <p className="mt-2 text-sm font-semibold text-orange-600">
                @{user.username}
              </p>

              {editing ? (
                <div className="mt-5 w-full max-w-2xl">
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={
                      handleInputChange
                    }
                    placeholder="Write something about yourself..."
                    rows="3"
                    className="w-full resize-none border-b-2 border-orange-200 bg-transparent px-3 pb-2 text-center text-sm font-medium leading-7 text-gray-700 focus:border-orange-400 focus:outline-none"
                  />
                </div>
              ) : (
                <p className="mt-5 max-w-2xl text-center text-sm font-medium leading-7 text-gray-600">
                  {user.about}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <ProfileCard
              icon={
                <AtSign size={18} />
              }
              title="Username"
              value={`@${user.username}`}
            />

            <ProfileCard
              icon={
                <Mail size={18} />
              }
              title="Email Address"
              value={user.email}
            />

            <ProfileCard
              icon={
                <Clock size={18} />
              }
              title="Last Seen"
              value={
                user.isOnline
                  ? "Currently Online"
                  : formatDate(
                      user.lastSeen
                    )
              }
            />

            <ProfileCard
              icon={
                <Clock size={18} />
              }
              title="Joined On"
              value={formatDate(
                user.createdAt
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center gap-3 text-orange-500">
        {icon}

        <h4 className="text-sm font-semibold text-gray-900">
          {title}
        </h4>
      </div>

      <p className="mt-4 break-all text-sm font-medium text-gray-700">
        {value}
      </p>
    </div>
  );
}

export default UserProfile;