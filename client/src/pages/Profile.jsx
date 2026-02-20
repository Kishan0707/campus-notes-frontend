import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../utils/api";
// import axios from "axios";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("campusUser"));
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  //

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get(`/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        toast.error("Failed to load profile");
        console.log(err);
      }
    };
    if (user?.id) loadProfile();
  }, []);

  const updateProfile = async () => {
    try {
      await API.put(
        `/users/${user.id}`,
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    }
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
          <b>Joined:</b>
          {new Date(profile.created_at).toLocaleDateString()}
        </p>

        <input
          type="text"
          className="w-full border p-2 mt-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="enter name"
        />
        <input
          type="text"
          className="w-full border p-2 mt-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter email"
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
