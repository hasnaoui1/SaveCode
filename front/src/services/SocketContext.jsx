// services/socketContext.js
import { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [connectedUsers, setUsers] = useState([]);
  const socketRef = useRef(null);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [collaboratingSnippetId, setCollaboratingSnippetId] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3002");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected:", socket.id);
      const token = localStorage.getItem("token");
      if (token) {
        socket.emit("setup", token);
      }
    });

    socket.on("connectedUsers", (users) => {
      setUsers(users);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("incomingCollabRequest", ({ snippetId, fromUserId }) => {
      Swal.fire({
        title: "Collaboration Request",
        text: `User ${fromUserId} wants to collaborate on snippet ${snippetId}. Accept?`,
        showCancelButton: true,
        confirmButtonText: "Accept",
        cancelButtonText: "Decline",
        position: "bottom-end",
        toast: true,
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit("collabAccepted", { snippetId, toUserId: fromUserId });
        }
      });
    });

    socket.on("collabStarted", ({ snippetId }) => {
      console.log(
        `SocketContext: Collaboration started for snippet ${snippetId}`
      );
      setIsCollaborating(true);
      setCollaboratingSnippetId(snippetId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendCollabRequest = (toUserId, snippetId) => {
    if (socketRef.current) {
      socketRef.current.emit("collabRequest", { toUserId, snippetId });
      console.log("Collab request sent");
    } else {
      console.error("Socket is not connected yet");
    }
  };

  return (
    <SocketContext.Provider
      value={{
        connectedUsers,
        sendCollabRequest,
        isCollaborating,
        setIsCollaborating,
        collaboratingSnippetId,
        setCollaboratingSnippetId,
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
