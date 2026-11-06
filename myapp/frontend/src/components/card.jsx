import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/Usercontext.jsx";
import { cardStyles } from "../assets/dummystyle.js";

export const ProfileInfoCard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
    }
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className={cardStyles.profileCard}>
      <div className={cardStyles.profileInitialsContainer}>
        <span className={cardStyles.profileInitialsText}>
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className={cardStyles.profileName}>{user.name || "User"}</span>
        <button
          type="button"
          className={cardStyles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Aliases for compatibility
export const profileinfoCard = ProfileInfoCard;

export default ProfileInfoCard;