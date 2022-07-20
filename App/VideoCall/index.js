import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Text,
} from "react-native";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useRoute,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from "react-native-webrtc";
import { profileUrl, userObj } from "../constant";
import AppFabButton from "../Components/AppFabButton";
import InCallManager from "react-native-incall-manager";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { SocketContext } from "../Context/Socket";

const urls = [
  "stun:bn-turn1.xirsys.com",
  "turn:bn-turn1.xirsys.com:3478?transport=udp",
  "turn:bn-turn1.xirsys.com:80?transport=udp",
  "turn:bn-turn1.xirsys.com:3478?transport=tcp",
  "turn:bn-turn1.xirsys.com:80?transport=tcp",
  "turns:bn-turn1.xirsys.com:443?transport=tcp",
  "turns:bn-turn1.xirsys.com:5349?transport=tcp",
];

const configuration = {
  iceServers: [
    { urls: ["stun:bn-turn1.xirsys.com"] },
    ...urls.map((ele) => ({
      url: ele,
      username:
        "OcBSZfFTJleQqUKJOKh-6y7vHJDso4yFIIGiUPzgX4GqPTMsZYPKJ-DzMMrhHXy4AAAAAGE_QvxoaXJlbnBhdGVsaHM=",
      credential: "8a7046e8-148d-11ec-9808-0242ac140004",
    })),
  ],
};

export default function VideoCall() {
  const { params } = useRoute();
  const { canGoBack, dispatch } = useNavigation();
  const { pop } = StackActions;

  const socket = React.useContext(SocketContext);

  const { systemUserId, currentUser, avtarUrl } = userObj;

  const [pc] = React.useState(new RTCPeerConnection(configuration));

  // const [socket] = useState(
  // 	io
  // 		.connect("wss://message.banjee.org/", {
  // 			upgrade: false,
  // 			transports: ["websocket"],
  // 			origins: "*",
  // 			forceNew: true,
  // 			reconnection: true,
  // 			reconnectionDelay: 200,
  // 			reconnectionDelayMax: 500,
  // 			reconnectionAttempts: Infinity,
  // 		})
  // 		.connect()
  // );
  const [mute, setMute] = useState(false);
  const [video, setVideo] = useState(false);
  const [userStream, setUserStream] = React.useState(null);
  const [myStream, setMyStream] = React.useState(null);
  const [renderState, setRenderState] = React.useState(false);

  const icecandidateHandler = React.useCallback(
    (data) => {
      const { candidate } = data;
      console.log("Getting icecandidate", candidate);

      const iceCandidate = {
        sdpMid: candidate?.sdpMid,
        sdp: candidate?.candidate,
        sdpMLineIndex: candidate?.sdpMLineIndex,
      };

      socket.emit("SIGNALLING_SERVER", {
        roomId: params.roomId,
        fromUserId: systemUserId,
        initiator: {
          ...currentUser,
          avtarImageUrl: avtarUrl,
          firstName: currentUser.userName,
        },
        targetUser: params.targetUser,
        toUserId: params.targetUser.id,
        eventType: "ICE_CANDIDATE",
        iceCandidate: iceCandidate,
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
    },
    [socket, params]
  );

  const streamHandler = React.useCallback(
    (params) => {
      console.log("Getting Streams");
      pc.addStream(params.stream);
      setUserStream(params.stream);
    },
    [pc]
  );

  const sendReady = useCallback(() => {
    socket.emit("SIGNALLING_SERVER", {
      roomId: params.roomId,
      toUserId: params.initiator.id,
      targetUser: params.initiator,
      initiator: params.targetUser,
      fromUserId: params.targetUser.id,
      eventType: "READY",
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
  }, [params]);

  const addMediaSteam = React.useCallback(() => {
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == "videoinput" &&
          sourceInfo.facing == (isFront ? "front" : "environment")
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          echoCancellation: true,
          noiseSuppression: true,
          video: {
            mandatory: {
              // minWidth: 480,
              // minHeight: 360,
              minFrameRate: 30,
            },
            facingMode: isFront ? "user" : "environment",
            optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
          },
        })
        .then((stream) => {
          setMyStream(stream);
          pc.addStream(stream);
        })
        .catch((error) => {
          console.log("Media Error ", error);
        });
    });
  }, [pc]);

  const createOffer = useCallback(
    (data) => {
      if (systemUserId === data?.initiator?.id) {
        pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
          .then(async (offer) => {
            console.log("------------------", params.roomId);

            socket.emit("SIGNALLING_SERVER", {
              roomId: params.roomId,
              fromUserId: systemUserId,
              initiator: {
                ...currentUser,
                avtarImageUrl: avtarUrl,
                firstName: currentUser.userName,
              },
              targetUser: params.targetUser,
              toUserId: params.targetUser.id,
              eventType: "OFFER",
              iceCandidate: null,
              offer: offer.sdp,
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
          })
          .catch((err) => {
            console.log("Create Offer ", err);
          });
      }
    },
    [systemUserId, pc, currentUser, avtarUrl, params]
  );

  const createAnswer = useCallback(
    async (data) => {
      if (systemUserId !== data?.initiator?.id) {
        await pc.setRemoteDescription(
          new RTCSessionDescription({ type: "offer", sdp: data.offer })
        );

        pc.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
          .then(async (answer) => {
            await pc.setLocalDescription(new RTCSessionDescription(answer));
            socket.emit("SIGNALLING_SERVER", {
              roomId: params.roomId,
              toUserId: systemUserId,
              targetUser: {
                ...currentUser,
                avtarImageUrl: avtarUrl,
                firstName: currentUser.userName,
              },
              initiator: params.targetUser,
              fromUserId: params.targetUser.id,
              eventType: "ANSWER",
              iceCandidate: null,
              offer: null,
              answer: answer.sdp,
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
          })
          .catch((err) => {
            console.log("Create Offer ", err);
          });
      } else {
        await pc.setLocalDescription(
          new RTCSessionDescription({ type: "offer", sdp: data.offer })
        );
      }
    },
    [systemUserId, pc, socket, currentUser, avtarUrl, params]
  );

  const reciveAnswer = useCallback(
    async (data) => {
      if (systemUserId === data?.initiator?.id) {
        await pc.setRemoteDescription(
          new RTCSessionDescription({ type: "answer", sdp: data.answer })
        );
      }
    },
    [systemUserId, pc]
  );

  const iceCandidateEvent = useCallback(
    async (data) => {
      const { iceCandidate } = data;

      if (iceCandidate && Object.keys(iceCandidate).length > 0) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
        } catch (err) {
          console.log("err", err);
        }
      } else {
        sendReady();
      }
    },
    [sendReady, pc]
  );

  // const useEffectFun = React.useCallback(() => {

  // })

  useEffect(() => {
    addMediaSteam();
    if (systemUserId === params.targetUser.id) {
      sendReady();
    }
    // });
    InCallManager.stopRingtone();
    InCallManager.start({ media: "video" });
    socket.on("READY", (data) => {
      createOffer(data);
    });

    socket.on("OFFER", async (data) => {
      await createAnswer(data);
    });

    socket.on("ANSWER", async (data) => {
      await reciveAnswer(data);
    });

    socket.on("ICE_CANDIDATE", async (data) => {
      await iceCandidateEvent(data);
    });

    pc.onicecandidate = icecandidateHandler;
    pc.onaddstream = streamHandler;

    // return () => {
    //   InCallManager.stop();
    //   pc.removeStream(userStream);
    //   pc.close();
    // };
  }, [
    socket,
    sendReady,
    addMediaSteam,
    createOffer,
    icecandidateHandler,
    streamHandler,
    pc,
  ]);

  //   socket.on("DISCONNECT", async () => {
  //     // await connectSocket(socket);
  //     pc.removeStream(userStream);
  //     pc.close();
  //     if (canGoBack()) {
  //       dispatch(pop(2));
  //     }
  //   });
  // socket.on("VIDEO_UNMUTE", (data) => {
  // 	if (data?.initiator?.id === systemUserId && myStream) {
  // 		console.log("VIDEO_UNMUTE");
  // 		myStream.getVideoTracks()[0].enabled = true;
  // 	}
  // });
  // socket.on("VIDEO_MUTE", (data) => {
  // 	if (data?.initiator?.id === systemUserId && myStream) {
  // 		console.log("VIDEO_MUTE");
  // 		myStream.getVideoTracks()[0].enabled = false;
  // 	}
  // });

  const remoteVideo = userStream ? (
    <Fragment>
      {myStream?.getVideoTracks()[0].enabled ? (
        <RTCView
          key={2}
          mirror={false}
          style={{ ...styles.rtcViewRemote }}
          objectFit="cover"
          streamURL={userStream.toURL()}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ImageBackground
            resizeMode="cover"
            source={{ uri: profileUrl(params?.targetUser?.avtarImageUrl) }}
            blurRadius={2}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      )}
    </Fragment>
  ) : (
    <View style={{ flex: 1, width: "100%" }}>
      {systemUserId === params.initiator.id ? (
        <ImageBackground
          resizeMode="cover"
          source={{ uri: profileUrl(params?.targetUser?.avtarImageUrl) }}
          blurRadius={2}
          style={{ height: "100%", width: "100%" }}
        >
          <View style={styles.subView}>
            <View>
              <Text style={styles.name}>
                {params?.targetUser?.userName
                  ? params?.targetUser?.userName
                  : params?.targetUser?.firstName}
              </Text>

              <Text style={styles.subText}>Ringing ....</Text>
            </View>
            <AppFabButton
              style={{ borderRadius: 50, backgroundColor: "red" }}
              onPress={() => {
                if (canGoBack()) {
                  dispatch(pop(2));
                }
              }}
              icon={
                <Image
                  source={require("../Assets/ic_call.png")}
                  style={[
                    styles.callImg,
                    { transform: [{ rotate: "130deg" }] },
                  ]}
                />
              }
            />
          </View>
        </ImageBackground>
      ) : (
        <ImageBackground
          resizeMode="cover"
          source={{ uri: profileUrl(params?.initiator?.avtarImageUrl) }}
          blurRadius={2}
          style={{ height: "100%", width: "100%" }}
        >
          <View style={styles.subView}>
            <View>
              <Text style={styles.name}>
                {params?.initiator?.userName
                  ? params?.initiator?.userName
                  : params?.initiator?.firstName}
              </Text>

              <Text style={styles.subText}>Ringing....</Text>
            </View>

            <AppFabButton
              style={{ borderRadius: 50, zIndex: 1, backgroundColor: "red" }}
              onPress={() => {
                if (canGoBack()) {
                  dispatch(pop(2));
                }
              }}
              icon={
                <Image
                  source={require("../Assets/ic_call.png")}
                  style={[
                    styles.callImg,
                    { transform: [{ rotate: "130deg" }] },
                  ]}
                />
              }
            />
          </View>
        </ImageBackground>
      )}
    </View>
  );

  //   if (renderState) {
  return (
    <View style={{ ...styles.videosContainer }}>
      {/* <ScrollView style={{ ...styles.scrollView }}> */}
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {remoteVideo}
      </View>
      {userStream && myStream && (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            bottom: 10,
            right: 10,
            width: 100,
            height: 200,
            backgroundColor: "black", //width: '100%', height: '100%'
          }}
        >
          <View style={{ flex: 1 }}>
            {myStream?.getVideoTracks()[0].enabled ? (
              <RTCView
                key={1}
                zOrder={0}
                objectFit="cover"
                style={{ ...styles.rtcView }}
                streamURL={myStream && myStream?.toURL()}
              />
            ) : (
              <Image
                style={{ height: "100%", width: "100%" }}
                resizeMode={"cover"}
                source={{
                  uri: profileUrl(params?.initiator?.avtarImageUrl),
                }}
              />
            )}
          </View>
        </View>
      )}
      {/* {userStream && myStream && (
        <View>
          <View style={{ position: "absolute", right: 20, top: 40 }}>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#FFF",
                padding: 7,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => myStream?._tracks[1]._switchCamera()}
            >
              <MaterialIcons
                name="flip-camera-android"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#FFF",
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={() => {
                myStream.getAudioTracks()[0].enabled =
                  !myStream.getAudioTracks()[0].enabled;
              }}
            >
              {!myStream.getAudioTracks()[0].enabled ? (
                <Feather name="mic" size={22} color="white" />
              ) : (
                <Feather name="mic-off" size={22} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#FFF",
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={() => {
                // myStream.getVideoTracks()[0].enabled
                // 	? socket.emit("SIGNALLING_SERVER", {
                // 			roomId: params.roomId,
                // 			fromUserId: systemUserId,
                // 			initiator: {
                // 				...currentUser,
                // 				avtarImageUrl: avtarUrl,
                // 				firstName: currentUser.userName,
                // 			},
                // 			targetUser: params.targetUser,
                // 			toUserId: params.targetUser.id,
                // 			eventType: "VIDEO_MUTE",
                // 			iceCandidate: null,
                // 			offer: null,
                // 			answer: null,
                // 			mediaStream: null,
                // 			responseMessage: "Room Joined",
                // 			callDuration: "00",
                // 			callType: "Video",
                // 			groupName: null,
                // 			toAvatarSrc: null,
                // 			groupMemberCounts: 0,
                // 			groupCreatorId: null,
                // 			addToCall: false,
                // 	  })
                // 	: socket.emit("SIGNALLING_SERVER", {
                // 			roomId: params.roomId,
                // 			fromUserId: systemUserId,
                // 			initiator: {
                // 				...currentUser,
                // 				avtarImageUrl: avtarUrl,
                // 				firstName: currentUser.userName,
                // 			},
                // 			targetUser: params.targetUser,
                // 			toUserId: params.targetUser.id,
                // 			eventType: "VIDEO_UNMUTE",
                // 			iceCandidate: null,
                // 			offer: null,
                // 			answer: null,
                // 			mediaStream: null,
                // 			responseMessage: "Room Joined",
                // 			callDuration: "00",
                // 			callType: "Video",
                // 			groupName: null,
                // 			toAvatarSrc: null,
                // 			groupMemberCounts: 0,
                // 			groupCreatorId: null,
                // 			addToCall: false,
                // 	  });
                myStream.getVideoTracks()[0].enabled =
                  !myStream.getVideoTracks()[0].enabled;
              }}
            >
              {!myStream.getVideoTracks()[0].enabled ? (
                <Feather name="video" size={22} color="white" />
              ) : (
                <Feather name="video-off" size={22} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ position: "absolute", bottom: 60 }}>
            <AppFabButton
              style={{ borderRadius: 50, backgroundColor: "red" }}
              // onPress={goBack}
              icon={
                <Image
                  source={require("../Assets/ic_call.png")}
                  style={[
                    {
                      height: 24,
                      width: 24,
                      transform: [{ rotate: "130deg" }],
                    },
                  ]}
                />
              }
            />
          </View>
          <AppFabButton
            style={{
              position: "absolute",
              bottom: 30,
              right: 185,
              borderRadius: 50,
              backgroundColor: "red",
            }}
            onPress={async () => {
              socket.emit("SIGNALLING_SERVER", {
                roomId: params.roomId,
                fromUserId: systemUserId,
                initiator: {
                  ...currentUser,
                  avtarImageUrl: avtarUrl,
                  firstName: currentUser.userName,
                },
                targetUser: params.targetUser,
                toUserId: params.targetUser.id,
                eventType: "DISCONNECT",
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
              // await connectSocket(socket);
            }}
            icon={
              <Image
                source={require("../Assets/ic_call.png")}
                style={[styles.callImg, { transform: [{ rotate: "130deg" }] }]}
              />
            }
          />
        </View>
      )} */}

      {/* </ScrollView> */}
    </View>
  );
  //   } else return null;
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    margin: 5,
    paddingVertical: 10,
    backgroundColor: "lightgrey",
    borderRadius: 5,
  },
  textContent: {
    fontFamily: "Avenir",
    fontSize: 20,
    textAlign: "center",
  },
  videosContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  rtcView: {
    width: 100, //dimensions.width,
    height: 200, //dimensions.height / 2,
    backgroundColor: "black",
  },
  scrollView: {
    flex: 1,
    // flexDirection: 'row',
    backgroundColor: "teal",
    padding: 15,
  },
  rtcViewRemote: {
    width: "100%",
    zIndex: 0,
    height: "100%", //dimensions.height / 2,
    // backgroundColor: "black",
  },
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
