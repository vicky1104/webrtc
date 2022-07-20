import IncomingCall from "../Screens/IncomingCall";
import OutgoingCall from "../Screens/OutgoingCall";
// import VideoCall from "../VideoCall";
import VideoCall from "../VideoCall/VideoCall";
import Default from "../Screens/Default";

export const NavigationJson = [
  {
    name: "Default",
    component: Default,
    options: {
      headerShown: false,
    },
  },
  {
    name: "IncomingCall",
    component: IncomingCall,
    options: {
      headerShown: false,
    },
  },
  {
    name: "OutgoingCall",
    options: {
      headerShown: false,
    },
    component: OutgoingCall,
  },
  {
    name: "VideoCall",
    options: {
      headerShown: false,
    },
    component: VideoCall,
  },
];
