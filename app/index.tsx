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

interface PomodoroPattern {
	focusTime: number;
	shortBreakTime: number;
	longBreakTime: number;
	intervals: number;
}

export default function Index() {
	const [timerInput, setTimerInput] = useState("");
	const [timer, setTimer] = useState(0);
	const [timerState, setTimerState] = useState<"running" | "paused" | "idle">(
		"idle"
	);

	const [pomodoroPattern, setPomodoroPattern] = useState<PomodoroPattern>({
		focusTime: 25,
		// focusTime: 25 * 60 * 1000,
		shortBreakTime: 5,
		// shortBreakTime: 5 * 60 * 1000,
		longBreakTime: 15,
		// longBreakTime: 15 * 60 * 1000,
		intervals: 3,
	});

	const [currentInterval, setCurrentInterval] = useState(0);
	const [currentState, setCurrentState] = useState<
		"focus" | "shortBreak" | "longBreak"
	>("focus");
	const [settingModalVisible, setSettingModalVisible] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const onStart = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setTimer(Number(pomodoroPattern.focusTime) * 1000);
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

	const onPomodoroPatternChange = (
		keyToChange: "focusTime" | "shortBreakTime" | "longBreakTime" | "intervals",
		newVal: string
	) => {
		let newFormattedValue = Number(newVal);
		if (keyToChange !== "intervals") {
			newFormattedValue = newFormattedValue;
			// newFormattedValue = newFormattedValue * 60 * 1000;
		}
		setPomodoroPattern((prevPattern) => ({
			...prevPattern,
			[keyToChange]: newFormattedValue,
		}));
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
			Vibration.vibrate([0, 1000, 1000, 1000]);
			console.log("000000");
			clearInterval(timerRef.current);
			setTimerState("idle");
		}
	}, [timer]);

	useEffect(() => {
		console.log({ pomodoroPattern });
	}, [pomodoroPattern]);

	return (
		<SafeAreaView className="flex-1">
			<SettingModal
				visible={settingModalVisible}
				onRequestClose={toggleSettingModalVisibility}
			>
				<View className=" gap-y-2">
					<View className="flex-row justify-between items-center">
						<Text>Focus Time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							// placeholder="Focus time"
							value={pomodoroPattern.focusTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("focusTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Short break time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="Short break time"
							value={pomodoroPattern.shortBreakTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("shortBreakTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Long break time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="Long break time"
							value={pomodoroPattern.longBreakTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("longBreakTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Intervals</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="intervals"
							value={pomodoroPattern.intervals.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("intervals", text)
							}
						/>
					</View>
				</View>
			</SettingModal>
			<Button title="Change Setting" onPress={toggleSettingModalVisibility} />
			{timerState === "idle" ? (
				<View className=" gap-y-2">
					<View className="flex-row justify-between items-center">
						<Text>Focus Time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							// placeholder="Focus time"
							value={pomodoroPattern.focusTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("focusTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Short break time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="Short break time"
							value={pomodoroPattern.shortBreakTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("shortBreakTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Long break time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="Long break time"
							value={pomodoroPattern.longBreakTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("longBreakTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Intervals</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="intervals"
							value={pomodoroPattern.intervals.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("intervals", text)
							}
						/>
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
