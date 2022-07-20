import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { rjPatelData } from "../constant";

function Default(props) {
  const { navigate } = useNavigation();

  const handleClickCall = () => {
    console.log("navigate to outgoing call");
    navigate("OutgoingCall", rjPatelData);
  };

  return (
    <View style={styles.container}>
      <Button title="Call RJ Patel" onPress={handleClickCall} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Default;
