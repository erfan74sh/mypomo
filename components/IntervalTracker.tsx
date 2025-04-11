import { View, Text } from "react-native";
import React from "react";

interface Props {
	totalIntervals: number;
	currentInterval: number;
}

const IntervalTracker = ({ totalIntervals, currentInterval }: Props) => {
	return (
		<View className="flex-row items-center justify-center gap-x-2">
			{Array.from({ length: totalIntervals }, (_, index) => (
				<View
					key={index}
					className={`w-4 h-4 rounded-full border-2 ${
						index < currentInterval - 1 ? "bg-sky-500" : "bg-gray-300"
					} ${
						index <= currentInterval - 1 ? "border-sky-500" : "border-gray-300"
					}`}
				/>
			))}
		</View>
	);
};

export default IntervalTracker;
