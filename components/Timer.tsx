import { View, Text } from "react-native";
import React, { useRef } from "react";
import { formatTime } from "@/utils/formatTime";

interface TimerProps {
	remainingTime: number;
}

const Timer = ({ remainingTime }: TimerProps) => {
	const [minutes, seconds] = formatTime(remainingTime);
	return (
		<View className="flex-row items-center justify-center gap-x-2">
			<Text className="text-7xl font-bold ">{minutes}</Text>
			<Text className="text-2xl font-bold">:</Text>
			<Text className="text-7xl font-bold ">{seconds}</Text>
		</View>
	);
};

export default Timer;
