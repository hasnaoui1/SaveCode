import React from "react";
import AppRoutes from "./AppRoutes";
import { UserContextProvider } from "./services/UserContext";
import { SnippetProvider } from "./services/SnippetContext";
import { SocketProvider } from "./services/socketContext";

export default function App() {
  return (
    <UserContextProvider>
      <SnippetProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </SnippetProvider>
    </UserContextProvider>
  );
}
