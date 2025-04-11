import Focus from "@/components/Focus";
import { colors } from "@/utils/colors";
import {
	Alert,
	AppState,
	Button,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";

import "./globals.css";

import { PaperProvider } from "react-native-paper";
import Timer from "@/components/Timer";
import { useEffect, useRef, useState } from "react";
import SettingModal from "@/components/SettingModal";
import useConfigStore from "@/stores/useConfigStore";
import IntervalTracker from "@/components/IntervalTracker";
import {
	CirclePause,
	CirclePlay,
	CircleStop,
	Play,
	Settings,
} from "lucide-react-native";
import { useTimerStore } from "@/stores/timerStore";
import {
	cancelPomodoroNotification,
	getNotifications,
	requestNotificationPermissions,
	schedulePomodoroNotification,
} from "@/utils/notifications";

const startForSchedule = async (durationMinute: number) => {
	const now = new Date();
	const end = new Date(now.getTime() + durationMinute * 60 * 1000);
	const notifId = await schedulePomodoroNotification(end);
	console.log({ notifId });
	useTimerStore.getState().setTimer(now.toISOString(), durationMinute, notifId);
};

const getRemainingTime = (): number => {
	const { startTime, duration } = useTimerStore.getState();
	if (!startTime) return 0;
	const start = new Date(startTime).getTime();
	const now = new Date().getTime();
	const durationMs = duration * 60 * 1000;

	const remaining = start + durationMs - now;
	return Math.max(remaining, 0);
};

const cancelNotificationHandler = async () => {
	const notificationId = useTimerStore.getState().notificationId;
	console.log({ notificationId });
	if (notificationId) {
		await cancelPomodoroNotification(notificationId);
	}
};

export default function Index() {
	const [timerInput, setTimerInput] = useState("");
	const [timerState, setTimerState] = useState<"running" | "paused" | "idle">(
		"idle"
	);
	const appState = useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = useState(appState.current);

	const pomodoroPattern = useConfigStore((store) => store.pomodoroPattern);

	const [currentInterval, setCurrentInterval] = useState(1);
	const [currentState, setCurrentState] = useState<
		"focus" | "shortBreak" | "longBreak"
	>("focus");

	const [remainingTime, setRemainingTime] = useState(
		Number(pomodoroPattern.focusTime)
	);

	const [settingModalVisible, setSettingModalVisible] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const setTimerBasedOnState = () => {
		switch (currentState) {
			case "focus":
				setRemainingTime(Number(pomodoroPattern.focusTime));
				break;
			case "shortBreak":
				setRemainingTime(Number(pomodoroPattern.shortBreakTime));
				break;
			case "longBreak":
				setRemainingTime(Number(pomodoroPattern.longBreakTime));
				break;
		}
	};

	const setNextState = () => {
		if (currentState === "focus") {
			if (currentInterval >= pomodoroPattern.intervals) {
				setCurrentState("longBreak");
			} else {
				setCurrentState("shortBreak");
			}
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
	};

	const onStart = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setTimerState("running");
		startForSchedule(remainingTime / 60);
		timerRef.current = setInterval(() => {
			setRemainingTime((prev) => prev - 1);
		}, 1000);
	};

	const onPause = async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
			await cancelNotificationHandler();
			useTimerStore.getState().clearTimer();
			setTimerState("paused");
		}
	};

	const onResume = () => {
		if (!timerRef.current && remainingTime > 0) {
			timerRef.current = setInterval(() => {
				setRemainingTime((prev) => prev - 1);
			}, 1000);
			setTimerState("running");
			startForSchedule(remainingTime / 60);
		} else {
			console.log("no remainingTime found");
		}
	};

	const onReset = async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setRemainingTime(pomodoroPattern.focusTime);
		setCurrentInterval(1);
		setCurrentState("focus");
		setTimerState("idle");

		await cancelNotificationHandler();
		useTimerStore.getState().clearTimer();
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
		(async () => {
			const remainigNotifs = await getNotifications();
			console.log({ remainigNotifs });
		})();
	});

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === "active"
			) {
				console.log("App has come to the foreground!");
			}

			appState.current = nextAppState;
			setAppStateVisible(appState.current);
			console.log("AppState", appState.current);
		});

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		console.log({ appStateVisible });
		if (appStateVisible === "active" && timerState === "running") {
			const remaining = getRemainingTime();
			console.log({ remaining });
			setRemainingTime(remaining / 1000);
		}
	}, [appStateVisible]);

	useEffect(() => {
		(async () => {
			await requestNotificationPermissions();
		})();
	}, []);

	useEffect(() => {
		if (remainingTime <= 0 && timerRef.current) {
			Vibration.vibrate();
			clearInterval(timerRef.current);
			setTimerState("idle");
			setNextState();
		}
	}, [remainingTime]);

	useEffect(() => {
		setTimerBasedOnState();
	}, [currentState, pomodoroPattern]);

	return (
		<SafeAreaView className="flex-1">
			<SettingModal
				visible={settingModalVisible}
				onRequestClose={toggleSettingModalVisibility}
			/>
			<View className="flex-1 justify-center bg-slate-100">
				<View className="absolute top-4 right-4">
					<TouchableOpacity
						accessibilityLabel="Change Setting"
						onPress={toggleSettingModalVisibility}
						className=" bg-slate-200 p-2 rounded-md"
					>
						<Settings color="#000" />
					</TouchableOpacity>
				</View>
				<View className="flex-col gap-y-6 my-auto">
					<View className="flex flex-row gap-x-2 items-center justify-center">
						<Text className="bg-sky-500 px-2 py-1.5 rounded-md text-center align-middle">
							{currentState}
						</Text>
					</View>
					<Timer remainingTime={remainingTime} />
					<IntervalTracker
						totalIntervals={pomodoroPattern.intervals}
						currentInterval={currentInterval}
					/>
				</View>
			</View>
			<View className="absolute bottom-4 w-full px-10">
				{timerState === "idle" ? (
					<TouchableOpacity
						onPress={onStart}
						className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
					>
						<CirclePlay color="#000" />
						<Text className="font-semibold">Start</Text>
					</TouchableOpacity>
				) : (
					<View className="flex-col gap-y-1">
						<TouchableOpacity
							onPress={onReset}
							className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<CircleStop color="#000" />
							<Text className="font-semibold">Reset</Text>
						</TouchableOpacity>
						{timerState === "running" ? (
							<TouchableOpacity
								onPress={onPause}
								className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
							>
								<CirclePause color="#000" />
								<Text className="font-semibold">Pause</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								onPress={onResume}
								className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
							>
								<CirclePlay color="#000" />
								<Text className="font-semibold">Resume</Text>
							</TouchableOpacity>
						)}
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}
