import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:4000/profile", { name, email });
      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:4000/password", {
        oldPassword: oldPass,
        newPassword: newPass,
      });
      alert("Password updated");
      setOldPass("");
      setNewPass("");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">Settings</h2>
      <form onSubmit={updateProfile} className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="text-lg mb-3">Profile</h3>
        <input
          className="w-full p-2 mb-3 bg-gray-900 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 bg-gray-900 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-indigo-600 px-3 py-2 rounded">
          Update Profile
        </button>
      </form>
      <form onSubmit={changePassword} className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="text-lg mb-3">Change Password</h3>
        <input
          className="w-full p-2 mb-3 bg-gray-900 rounded"
          placeholder="Old Password"
          type="password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 bg-gray-900 rounded"
          placeholder="New Password"
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button className="bg-indigo-600 px-3 py-2 rounded">
          Update Password
        </button>
      </form>
      <button onClick={logout} className="bg-red-600 px-3 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
