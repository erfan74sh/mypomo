import Focus from "@/components/Focus";
import * as Font from "expo-font";
import { colors } from "@/utils/colors";
import {
	Alert,
	AppState,
	Button,
	Modal,
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
import { requestNotificationPermissions } from "@/utils/notifications";
import usePomodoroTimer from "@/hooks/usePomodoroTimer";
import StateTracker from "@/components/StateTracker";

const getRemainingTime = (): number => {
	const { startTime, duration } = useTimerStore.getState();
	if (!startTime) return 0;
	const start = new Date(startTime).getTime();
	const now = new Date().getTime();
	const durationMs = duration * 60 * 1000;

	const remaining = start + durationMs - now;
	return Math.max(remaining, 0);
};

export default function Index() {
	const appState = useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = useState(appState.current);

	const {
		timerState,
		currentState,
		currentInterval,
		remainingTime,
		showCycleCompleteModal,
		start,
		pause,
		resume,
		reset,
		skip,
		startNextCycle,
		setRemainingTime,
	} = usePomodoroTimer();

	const pomodoroPattern = useConfigStore((store) => store.pomodoroPattern);

	const [settingModalVisible, setSettingModalVisible] = useState(false);

	const toggleSettingModalVisibility = () => {
		setSettingModalVisible(!settingModalVisible);
	};

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === "active"
			)
				appState.current = nextAppState;
			setAppStateVisible(appState.current);
		});

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		if (appStateVisible === "active" && timerState === "running") {
			const remaining = getRemainingTime();
			setRemainingTime(remaining / 1000);
		}
	}, [appStateVisible]);

	useEffect(() => {
		(async () => {
			await requestNotificationPermissions();
		})();
	}, []);

	return (
		<SafeAreaView className="flex-1">
			{showCycleCompleteModal && (
				<Modal transparent animationType="fade" visible={true}>
					<View className="flex-1 justify-center items-center bg-black/50">
						<View className="bg-white p-6 rounded-lg gap-y-3">
							<Text className="text-lg font-bold text-center">
								🎉 Cycle Complete!
							</Text>
							<Text className="text-center">
								Would you like to start a new cycle?
							</Text>
							<View className="mt-4 gap-y-2">
								<TouchableOpacity
									className="bg-sky-500 py-3 px-4 rounded-md"
									onPress={startNextCycle}
								>
									<Text className="text-white text-center font-semibold">
										Start Next Cycle
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="bg-slate-300 py-3 px-4 rounded-md"
									onPress={reset}
								>
									<Text className="text-center font-semibold">Reset</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			)}
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
						<StateTracker currentState={currentState} />
						{/* <Text className="bg-sky-500 px-2 py-1.5 rounded-md text-center align-middle">
							{currentState}
						</Text> */}
					</View>
					<Timer remainingTime={remainingTime} />
					<IntervalTracker
						totalIntervals={pomodoroPattern.intervals}
						currentInterval={currentInterval}
						curentState={currentState}
					/>
				</View>
			</View>
			<View className="absolute bottom-4 w-full px-10">
				{timerState === "idle" ? (
					<TouchableOpacity
						onPress={start}
						className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
					>
						<CirclePlay color="#000" />
						<Text className="font-semibold">Start</Text>
					</TouchableOpacity>
				) : (
					<View className="flex-col gap-y-1">
						<TouchableOpacity
							onPress={reset}
							className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<CircleStop color="#000" />
							<Text className="font-semibold">Reset</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={skip}
							className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<CircleStop color="#000" />
							<Text className="font-semibold">Skip</Text>
						</TouchableOpacity>
						{timerState === "running" ? (
							<TouchableOpacity
								onPress={pause}
								className="bg-sky-500 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
							>
								<CirclePause color="#000" />
								<Text className="font-semibold">Pause</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								onPress={resume}
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
