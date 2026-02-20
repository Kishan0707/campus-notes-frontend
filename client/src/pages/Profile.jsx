import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("campusUser"));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");

  const updateProfile = () => {
    const updatedUser = { ...user, name, email, password };
    localStorage.setItem("campusUser", JSON.stringify(updatedUser));
    toast.success("Profile updated");
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2">
        <p>
          <b>Role:</b>
          {user.role}
        </p>
        <p>
          <b>Joined:</b>{" "}
          {user?.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "N/A"}
        </p>

        <input
          type="text"
          className="w-full border p-2 mt-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="enter new  Username"
        />
        <input
          type="text"
          className="w-full border p-2 mt-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter new email"
        />
        <input
          type="text"
          className="w-full border p-2 mt-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter new password"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded "
          onClick={updateProfile}
        >
          Update Profile
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
