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

export default function Index() {
	const [timerInput, setTimerInput] = useState("");
	const [timer, setTimer] = useState(0);
	const [timerState, setTimerState] = useState<"running" | "paused" | "idle">(
		"idle"
	);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const onStart = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setTimer(Number(timerInput) * 1000);
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

	return (
		<SafeAreaView className="flex-1">
			{timerState === "idle" ? (
				<TextInput
					className="bg-red-50"
					keyboardType="numeric"
					placeholder="seconds"
					value={timerInput}
					onChangeText={(text) => setTimerInput(text)}
				/>
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
