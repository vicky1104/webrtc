import { Animated } from "react-native";
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationJson } from "./Navigation";

const Stack = createStackNavigator();

export default function NavigationView() {
  const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
          })
        : 0
    );

    return {
      cardStyle: {
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  screen.width, // Focused, but offscreen in the beginning
                  0, // Fully focused
                  screen.width * -0.3, // Fully unfocused
                ],
                extrapolate: "clamp",
              }),
              inverted
            ),
          },
        ],
      },
    };
  };
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: (props) => forSlide(props),
      }}
      hederMode="float"
      animtion="fade"
    >
      {NavigationJson.map((ele, index) => {
        return <Stack.Screen {...ele} key={index} />;
      })}
    </Stack.Navigator>
  );
}
