import { useContext } from "react";
import { UserContext } from "../services/UserContext";

const Settingsxd = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 text-white">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 space-y-8">
        {/* Profile Picture */}
        <div className="relative w-24 h-24 mx-auto rounded-full bg-blue-700 flex items-center justify-center text-3xl font-bold shadow-md">
          {user?.username[0]}
          <button className="absolute bottom-0 right-0 bg-neutral-600 p-1.5 rounded-full hover:bg-neutral-500 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        <h2 className="text-center text-xl font-semibold">{user?.username}</h2>

        {/* Change Password */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-medium text-neutral-300">
            Change Password
          </h3>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full bg-neutral-800 px-3 py-2 rounded focus:outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-neutral-800 px-3 py-2 rounded focus:outline-none"
          />
          <button className="w-full bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition">
            Update Password
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow space-y-3 border-t border-neutral-700">
          <button className="w-full bg-red-700 px-4 py-2 rounded hover:bg-red-800 transition">
            Delete All Posts
          </button>
          <button className="w-full bg-red-800 px-4 py-2 rounded hover:bg-red-900 transition">
            Delete Account
          </button>
        </div>

        {/* Logout */}
        <button className="w-full bg-neutral-800 px-4 py-2 rounded hover:bg-neutral-700 transition shadow">
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 space-y-8">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>

        {/* Profile Info */}
        <div className="bg-neutral-900 p-6 rounded-lg shadow space-y-6">
          <h2 className="text-xl font-semibold text-neutral-300">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Username
              </label>
              <input
                type="text"
                defaultValue={user?.username}
                className="w-full bg-neutral-800 px-3 py-2 rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full bg-neutral-800 px-3 py-2 rounded focus:outline-none"
              />
            </div>
          </div>
          <button className="mt-4 bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition">
            Update Profile
          </button>
        </div>

        {/* Preferences */}
        <div className="bg-neutral-900 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold text-neutral-300">
            Preferences
          </h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="darkMode">Dark Mode</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="notifications">Email Notifications</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settingsxd;
