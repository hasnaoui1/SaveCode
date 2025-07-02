import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./Auth/Signin";
import SignUp from "./Auth/Signup";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Test from "./pages/Test";
import Layout from "./pages/Layout";
import { UserContext } from "./services/UserContext";
import Posts from "./pages/Posts";
import Settingsxd from "./pages/Settingsxd";
import Searchx from "./pages/Searchx";

export default function AppRoutes() {
  const { token } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="create/:snippetId?"
            element={token ? <CreatePost /> : <Navigate to="/signin" replace />}
          />
          <Route
            path="posts"
            element={token ? <Posts /> : <Navigate to="/signin" replace />}
          />

          <Route
            path="settings"
            element={token ? <Settingsxd /> : <Navigate to="/signin" replace />}
          />
          <Route path="profile" element={<Posts />} />
          <Route path="search/:title" element={<Searchx />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
