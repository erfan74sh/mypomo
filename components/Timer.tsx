import { View, Text } from "react-native";
import React, { useRef } from "react";

interface TimerProps {
	initialTimer: number;
}

const Timer = ({ initialTimer }: TimerProps) => {
	const timerId = useRef();

	return (
		<View>
			<Text>Timer</Text>
		</View>
	);
};

export default Timer;
