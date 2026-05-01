import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Users,
  Phone,
  Settings,
} from "lucide-react";
import { Assets } from "../assets/Assets";

function Sidebar({ activePage, onNavigate }) {
  const USER_KEY = "whatsapp_clone_user";

  const [storedUser, setStoredUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(USER_KEY)
      ) || null;
    } catch {
      return null;
    }
  });

  const [notice, setNotice] = useState("");

  useEffect(() => {
    const syncUserProfile = () => {
      try {
        const updatedUser =
          JSON.parse(
            localStorage.getItem(USER_KEY)
          ) || null;

        setStoredUser((prevUser) => {
          if (
            JSON.stringify(prevUser) !==
            JSON.stringify(updatedUser)
          ) {
            return updatedUser;
          }

          return prevUser;
        });
      } catch {
        setStoredUser(null);
      }
    };

    syncUserProfile();

    window.addEventListener(
      "storage",
      syncUserProfile
    );

    window.addEventListener(
      "profileUpdated",
      syncUserProfile
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncUserProfile
      );

      window.removeEventListener(
        "profileUpdated",
        syncUserProfile
      );
    };
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timeout = setTimeout(() => {
      setNotice("");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [notice]);

  const navItems = [
    {
      id: "chats",
      title: "Messages",
      icon: MessageCircle,
      hint: "Messages",
      enabled: true,
    },
    {
      id: "users",
      title: "Users",
      icon: Users,
      hint: "Users",
      enabled: false,
    },
    {
      id: "calls",
      title: "Calls",
      icon: Phone,
      hint: "Calls",
      enabled: false,
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      hint: "Settings",
      enabled: false,
    },
  ];

  const handleClick = (item) => {
    if (!item.enabled) {
      setNotice(
        `${item.title} feature is under development and will be available soon.`
      );

      return;
    }

    onNavigate(item.id);
  };

  const handleProfileClick = () => {
    onNavigate("profile");
  };

  const profileImage =
    storedUser?.profileImage &&
      typeof storedUser.profileImage ===
      "string" &&
      storedUser.profileImage.trim() !== ""
      ? storedUser.profileImage
      : Assets.profile;

  return (
    <>
      <aside className="fixed left-0 top-12 z-40 flex h-[calc(100vh-3rem)] w-16 flex-col items-center justify-between bg-[#FFF3E8]/90 py-5 backdrop-blur-md">
        <div className="flex flex-col items-center gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.id;

            return (
              <div
                key={item.id}
                className="group relative"
              >
                <button
                  type="button"
                  title={item.title}
                  onClick={() =>
                    handleClick(item)
                  }
                  className={`rounded-2xl p-3 transition-all duration-300 ${isActive
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-800 hover:bg-orange-100 hover:text-orange-600"
                    }`}
                >
                  <Icon size={22} />
                </button>

                <div className="pointer-events-none absolute left-16 top-1/2 z-50 hidden -translate-y-1/2 group-hover:flex">
                  <div className="rounded-xl border border-orange-200 bg-[#FFF3E8] px-3 py-2 text-xs font-semibold text-orange-700 shadow-lg">
                    {item.hint}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="group relative pb-2">
          <button
            type="button"
            title="Profile"
            onClick={handleProfileClick}
            className={`rounded-full p-1.5 shadow-sm transition-all duration-300 ${activePage === "profile"
                ? "bg-orange-100 ring-2 ring-orange-300"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            <img
              key={profileImage}
              src={profileImage}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.onerror =
                  null;

                e.currentTarget.src =
                  Assets.profile;
              }}
              className="h-10 w-10 rounded-full object-cover"
            />
          </button>

          <div className="pointer-events-none absolute left-16 top-1/2 z-50 hidden -translate-y-1/2 group-hover:flex">
            <div className="rounded-xl border border-orange-200 bg-[#FFF3E8] px-3 py-2 text-xs font-semibold text-orange-700 shadow-lg">
              Profile
            </div>
          </div>
        </div>
      </aside>

      {notice && (
        <div className="fixed bottom-6 left-24 z-[100] rounded-2xl border border-orange-200 bg-[#FFF3E8] px-5 py-3 text-sm font-semibold text-orange-700 shadow-xl backdrop-blur-md">
          {notice}
        </div>
      )}
    </>
  );
}

export default Sidebar;