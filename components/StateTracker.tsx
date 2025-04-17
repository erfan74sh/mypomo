import { View, Text } from "react-native";
import React from "react";

export default function StateTracker({
	currentState,
}: {
	currentState: "focus" | "shortBreak" | "longBreak";
}) {
	const getStateText = () => {
		switch (currentState) {
			case "focus":
				return {
					title: "Time to Focus:",
					subTitle: "Dive deep into your work.",
				};
			case "shortBreak":
				return {
					title: "Break Time:",
					subTitle: "A quick rest can boost your focus.",
				};
			case "longBreak":
				return {
					title: "Time to Relax:",
					subTitle: "Great job—enjoy a well-deserved rest!",
				};
			default:
				return { title: "", subTitle: "" };
		}
	};

	return (
		<View className="flex-col items-center justify-center gap-y-1">
			<Text className="text-sky-700 font-bold text-xl">
				{getStateText().title}
			</Text>
			<Text className="text-gray-600">{getStateText().subTitle}</Text>
		</View>
	);
}
