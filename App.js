import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import NavigationView from "./App/Routes/NavigationView";
import AuthSocket from "./App/Socket/Socket";
import { SocketContext, socket } from "./App/Context/Socket";
import SocketEvents from "./App/Socket/SocketEvents";
import Permissions from "./App/Permissions";

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      {/* <Permissions /> */}
      <AuthSocket>
        <NavigationContainer>
          <SocketEvents>
            <NavigationView />
          </SocketEvents>
        </NavigationContainer>
      </AuthSocket>
    </SocketContext.Provider>
  );
};

export default App;
