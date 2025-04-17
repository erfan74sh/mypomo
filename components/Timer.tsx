import { View, Text } from "react-native";
import React, { useRef } from "react";
import { formatTime } from "@/utils/formatTime";

interface TimerProps {
	remainingTime: number;
}

const Timer = ({ remainingTime }: TimerProps) => {
	const [minutes, seconds] = formatTime(remainingTime);
	return (
		<View className="flex-row items-center justify-center gap-x-2 ">
			<Text className="text-8xl font-black text-sky-700  leading-[96px]">
				{minutes}
			</Text>
			<Text className="text-6xl font-black text-sky-700 leading-[96px]">:</Text>
			<Text className="text-8xl font-black text-sky-700 leading-[96px]">
				{seconds}
			</Text>
		</View>
	);
};

export default Timer;
