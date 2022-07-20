import React from "react";
import { SocketContext } from "../Context/Socket";
import { systemUserId, token } from "../constant";

export default function AuthSocket({ children }) {
  const socket = React.useContext(SocketContext);

  const loginSocket = React.useCallback(async () => {
    console.log("Socket Login Running...");
    socket.on("connect", () => {
      console.log("socket connecting");
      socket.on("AUTH", (sessionId) => {
        console.log("socket auth");
        socket.emit("LOGIN", { token: token, sessionId });
      });
    });
  }, []);

  socket.on("connect_error", (err) => {
    console.log("socket connection error", err);
  });

  // Online Status Event Emit //
  socket.emit("ONLINE_STATUS_RECEIVER", systemUserId);

  React.useEffect(() => {
    loginSocket();
    socket.on("connect", () => {
      console.log("socket.connected", socket.connected);
    });
    socket.on("disconnect", (reason) => {
      console.log("socket.disconnected", socket.disconnected);
      console.log(reason);
      loginSocket();
      socket.emit("ONLINE_STATUS_RECEIVER", systemUserId);
    });
  }, [loginSocket]);

  return <>{children}</>;
}
