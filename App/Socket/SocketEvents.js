import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SocketContext } from "../Context/Socket";
import InCallManager from "react-native-incall-manager";
import { systemUserId } from "../constant";

function SocketEvent({ children }) {
  const socket = React.useContext(SocketContext);

  const { navigate } = useNavigation();

  React.useEffect(() => {
    socket.emit("ONLINE_STATUS_RECEIVER", systemUserId);
    socket.on("ON_JOIN", (data) => {
      console.log("call data ----->>");
      if (data?.initiator?.id !== systemUserId) {
        navigate("IncomingCall", { ...data });
        InCallManager.startRingtone("_BUNDLE_");
      } else if (data?.initiator?.id === systemUserId) {
        // if (data?.callType === "Video") {
        navigate("VideoCall", { ...data });
        // } else {
        //   navigate("Default");
        // }
      }
    });
  }, [socket]);

  return <React.Fragment>{children}</React.Fragment>;
}

export default SocketEvent;
