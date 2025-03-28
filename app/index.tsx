import Focus from "@/components/Focus";
import { colors } from "@/utils/colors";
import {
	Alert,
	Button,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	Vibration,
	View,
} from "react-native";

import "./globals.css";

import { PaperProvider } from "react-native-paper";
import Timer from "@/components/Timer";
import { useEffect, useRef, useState } from "react";
import SettingModal from "@/components/SettingModal";
import useConfigStore from "@/stores/useConfigStore";

export default function Index() {
	const [timerInput, setTimerInput] = useState("");
	const [timer, setTimer] = useState(0);
	const [timerState, setTimerState] = useState<"running" | "paused" | "idle">(
		"idle"
	);

	const pomodoroPattern = useConfigStore((store) => store.pomodoroPattern);

	const [currentInterval, setCurrentInterval] = useState(1);
	const [currentState, setCurrentState] = useState<
		"focus" | "shortBreak" | "longBreak"
	>("focus");

	const [settingModalVisible, setSettingModalVisible] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const setTimerBasedOnState = () => {
		switch (currentState) {
			case "focus":
				setTimer(Number(pomodoroPattern.focusTime) * 1000);
				break;
			case "shortBreak":
				setTimer(Number(pomodoroPattern.shortBreakTime) * 1000);
				break;
			case "longBreak":
				setTimer(Number(pomodoroPattern.longBreakTime) * 1000);
				break;
		}
	};

	const setNextState = () => {
		if (currentInterval >= pomodoroPattern.intervals) {
			setCurrentState("longBreak");
			setCurrentInterval(1);
		} else {
			if (currentState === "focus") {
				setCurrentState("shortBreak");
			} else if (currentState === "shortBreak") {
				setCurrentState("focus");
				setCurrentInterval((prev) => prev + 1);
			} else if (currentState === "longBreak") {
				Alert.alert(
					"Pomodoro Complete",
					"Congratulations! You've completed your pomodoro session.",
					[
						{
							text: "OK",
							onPress: () => {
								setCurrentState("focus");
								setCurrentInterval(1);
							},
						},
					]
				);
			}
		}
	};

	const onStart = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setTimerBasedOnState();
		setTimerState("running");
		timerRef.current = setInterval(() => {
			setTimer((prev) => prev - 1000);
		}, 1000);
	};

	const onPause = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
			setTimerState("paused");
		}
	};

	const onResume = () => {
		console.log({ timer, timerInput });
		if (!timerRef.current && timer > 0) {
			timerRef.current = setInterval(() => {
				setTimer((prev) => prev - 1000);
			}, 1000);
			setTimerState("running");
		} else {
			console.log("no timer found");
		}
	};

	const onReset = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setTimer(0);
		setTimerState("idle");
	};

	const toggleSettingModalVisibility = () => {
		setSettingModalVisible(!settingModalVisible);
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (timer === 0 && timerRef.current) {
			Vibration.vibrate();
			console.log("000000");
			clearInterval(timerRef.current);
			setTimerState("idle");
			setNextState();
		}
	}, [timer]);

	useEffect(() => {
		console.log({ currentInterval, currentState });
	}, [currentInterval, currentState]);

	return (
		<SafeAreaView className="flex-1">
			<SettingModal
				visible={settingModalVisible}
				onRequestClose={toggleSettingModalVisibility}
			/>

			<Button title="Change Setting" onPress={toggleSettingModalVisibility} />
			{timerState === "idle" ? (
				<View className=" gap-y-2">
					<View className="flex-row justify-between items-center">
						<Text>Focus Time</Text>
						<Text>{pomodoroPattern.focusTime}</Text>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Short break time</Text>
						<Text>{pomodoroPattern.shortBreakTime}</Text>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Long break time</Text>
						<Text>{pomodoroPattern.longBreakTime}</Text>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Intervals</Text>
						<Text>{pomodoroPattern.intervals}</Text>
					</View>
				</View>
			) : (
				<View>
					<Text>{timerInput}</Text>
					<Text>{timer}</Text>
				</View>
			)}
			{timerState === "idle" ? (
				<Button title="Start" onPress={onStart} />
			) : (
				<View>
					<Button title="Stop" onPress={onReset} />
					{timerState === "running" ? (
						<Button title="Pause" onPress={onPause} />
					) : (
						<Button title="Resume" onPress={onResume} />
					)}
				</View>
			)}
			{/* <Focus /> */}
			{/* <Timer /> */}
		</SafeAreaView>
	);
}
