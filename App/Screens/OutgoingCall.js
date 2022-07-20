import React, { useContext, useEffect } from "react";
import { View, ImageBackground, Image, StyleSheet, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { SocketContext } from "../Context/Socket";

import AppFabButton from "../Components/AppFabButton";
import { userObj, profileUrl } from "../constant";

export default function MakeVideoCall() {
  const { systemUserId, currentUser, avtarUrl, name } = userObj;

  const { params } = useRoute();

  const { goBack } = useNavigation();
  const socket = React.useContext(SocketContext);

  console.log(params);
  useEffect(() => {
    if (params.callType === "Video") {
      socket.emit("SIGNALLING_SERVER", {
        roomId: params.chatroomId,
        fromUserId: systemUserId,
        initiator: {
          ...currentUser,
          avtarImageUrl: avtarUrl,
          firstName: name,
        },
        targetUser: { ...params, avtarImageUrl: params?.avtarUrl },
        toUserId: params.id,
        eventType: "JOIN",
        iceCandidate: null,
        offer: null,
        answer: null,
        mediaStream: null,
        responseMessage: "Room Joined",
        callDuration: "00",
        callType: "Video",
        groupName: null,
        toAvatarSrc: null,
        groupMemberCounts: 0,
        groupCreatorId: null,
        addToCall: false,
      });
    } else {
      socket.emit("SIGNALLING_SERVER", {
        roomId: params.chatroomId,
        fromUserId: systemUserId,
        initiator: {
          ...currentUser,
          avtarImageUrl: avtarUrl,
          firstName: name,
        },
        targetUser: { ...params, avtarImageUrl: params?.avtarUrl },
        toUserId: params.id,
        eventType: "JOIN",
        iceCandidate: null,
        offer: null,
        answer: null,
        mediaStream: null,
        responseMessage: "Room Joined",
        callDuration: "00",
        callType: "Voice",
        groupName: null,
        toAvatarSrc: null,
        groupMemberCounts: 0,
        groupCreatorId: null,
        addToCall: false,
      });
    }
    return () => console.log("Outgoing Screen Leave");
  }, []);

  return (
    <>
      <ImageBackground
        resizeMode="cover"
        // source={{ uri: profileUrl(params.avtarUrl) }}
        blurRadius={2}
        style={{ height: "100%", width: "100%", backgroundColor: "#000" }}
      >
        <View style={styles.subView}>
          <View>
            <Text style={styles.name}>
              {params?.userName ? params.userName : params?.firstName}
            </Text>
            <Text style={styles.subText}>Calling....</Text>
          </View>

          <AppFabButton
            style={{ borderRadius: 50, backgroundColor: "red" }}
            onPress={goBack}
            icon={
              <Image
                source={require("../Assets/ic_call.png")}
                style={[styles.callImg, { transform: [{ rotate: "130deg" }] }]}
              />
            }
          />
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  subView: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  name: { fontSize: 30, alignSelf: "center", color: "white" },
  subText: {
    fontSize: 16,
    alignSelf: "center",
    color: "white",
    marginTop: 10,
  },
  callBackground: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  reciveCall: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
  },
  callImg: { height: 24, width: 24 },
});
