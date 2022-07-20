import React from "react";
import {
	View,
	TouchableWithoutFeedback,
	Animated,
	Easing,
	Platform,
} from "react-native";

export default function AppFabButton({ icon, ...rest }) {
	const maxOpacity = 0.12;
	const [state] = React.useState({
		maxOpacity,
		scaleValue: new Animated.Value(0.01),
		opacityValue: new Animated.Value(maxOpacity),
	});

	function onPressedIn() {
		Animated.timing(state.scaleValue, {
			toValue: 1,
			duration: 225,
			useNativeDriver: Platform.OS === "android",
			easing: Easing.bezier(0.0, 0.0, 0.2, 1),
		}).start();
	}
	function onPressedOut() {
		Animated.timing(state.opacityValue, {
			toValue: 0,
			useNativeDriver: Platform.OS === "android",
		}).start(() => {
			state?.scaleValue?.setValue(0.01);
			state?.opacityValue?.setValue(state.maxOpacity);
		});
	}

	function renderRippleView() {
		const { size } = rest;
		const { scaleValue, opacityValue } = state;

		const rippleSize = (size || 30) * 2;

		return (
			<Animated.View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: rippleSize,
					height: rippleSize,
					borderRadius: rippleSize / 2,
					transform: [{ scale: scaleValue }],
					opacity: opacityValue,
					backgroundColor: "black",
				}}
			/>
		);
	}

	const { size } = rest;
	const containerSize = (size || 30) * 2;
	const iconContainer = {
		width: containerSize,
		height: containerSize,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};

	return (
		<View {...rest}>
			<TouchableWithoutFeedback
				onPressIn={onPressedIn}
				onPressOut={onPressedOut}
				onPress={rest?.onPress}
			>
				<View style={iconContainer}>
					{renderRippleView()}
					<View>{icon}</View>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}
