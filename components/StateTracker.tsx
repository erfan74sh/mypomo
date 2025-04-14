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
				return "Focus Time";
			case "shortBreak":
				return "Short Break";
			case "longBreak":
				return "Long Break";
			default:
				return "Unknown";
		}
	};

	return (
		<View>
			<Text className="bg-sky-500 px-2 py-1.5 rounded-md text-center align-middle">
				{getStateText()}
			</Text>
		</View>
	);
}
