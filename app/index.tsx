import { useEffect, useMemo, useRef, useState } from "react";
import {
	AppState,
	Modal,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	AlarmClock,
	Pause,
	Play,
	RotateCcw,
	Settings,
	SkipForward,
} from "lucide-react-native";
import Timer from "@/components/Timer";
import SettingModal from "@/components/SettingModal";
import useConfigStore from "@/stores/useConfigStore";
import IntervalTracker from "@/components/IntervalTracker";
import StateTracker from "@/components/StateTracker";
import { useTimerStore } from "@/stores/timerStore";
import { requestNotificationPermissions } from "@/utils/notifications";
import usePomodoroTimer from "@/hooks/usePomodoroTimer";
import "./globals.css";

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

	const startTime = useTimerStore((state) => state.startTime);
	const duration = useTimerStore((state) => state.duration);

	const endTime = useMemo(() => {
		if (startTime && duration) {
			const start = new Date(startTime).getTime();
			const durationMs = duration * 60 * 1000;
			const end = start + durationMs;
			return new Date(end).toLocaleTimeString(undefined, {
				timeStyle: "medium",
				hour12: false,
			});
		}
		return null;
	}, [startTime, duration, currentState]);

	const hasSessionStarted = useMemo(() => {
		return (
			timerState !== "idle" || currentState !== "focus" || currentInterval !== 1
		);
	}, [timerState, currentState, currentInterval]);

	// const pomodoroPattern = useConfigStore((store) => store.pomodoroPattern);
	const intervals = useConfigStore((store) => store.intervals);

	const [settingModalVisible, setSettingModalVisible] = useState(false);

	const toggleSettingModalVisibility = () => {
		setSettingModalVisible(!settingModalVisible);
	};

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
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
									className="bg-sky-700 py-3 px-4 rounded-md"
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
				{timerState === "idle" ? (
					<View className="absolute top-4 right-4">
						<TouchableOpacity
							accessibilityLabel="Change Setting"
							onPress={toggleSettingModalVisibility}
							className=" bg-slate-200 p-2 rounded-md"
							disabled={timerState !== "idle"}
						>
							<Settings color="#374151" />
						</TouchableOpacity>
					</View>
				) : null}

				<View className="flex-col gap-y-7 my-auto">
					<View className="min-h-16">
						{hasSessionStarted && <StateTracker currentState={currentState} />}
					</View>
					<View className="">
						<Timer remainingTime={remainingTime} />
					</View>
					<View className="-mt-8 flex-row items-center gap-x-2 justify-center">
						{timerState !== "idle" && endTime && endTime !== "Invalid Date" ? (
							<AlarmClock color="#6b7280" size={16} />
						) : (
							""
						)}
						<Text className="text-center text-gray-500">
							{timerState !== "idle" && endTime && endTime !== "Invalid Date"
								? endTime
								: ""}
						</Text>
					</View>
					<View className="">
						<IntervalTracker
							totalIntervals={intervals}
							currentInterval={currentInterval}
							curentState={currentState}
						/>
					</View>
				</View>
			</View>
			<View className="flex-row absolute bottom-6 w-full justify-center items-center px-10">
				<View className="min-w-1">
					{hasSessionStarted ? (
						<TouchableOpacity
							onPress={reset}
							className="bg-slate-200 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<RotateCcw color="#374151" />
						</TouchableOpacity>
					) : null}
				</View>
				<View className="mx-auto">
					{timerState === "running" ? (
						<TouchableOpacity
							onPress={pause}
							className="bg-sky-700 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<Pause color="#f3f4f6" />
							<Text className="font-semibold text-gray-100">Pause</Text>
						</TouchableOpacity>
					) : timerState === "paused" ? (
						<TouchableOpacity
							onPress={resume}
							className="bg-sky-700 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<Play color="#f3f4f6" />
							<Text className="font-semibold text-gray-100">Resume</Text>
						</TouchableOpacity>
					) : timerState == "idle" ? (
						<TouchableOpacity
							onPress={start}
							className="bg-sky-700 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<Play color="#f3f4f6" />
							<Text className="font-semibold text-gray-100">Start</Text>
						</TouchableOpacity>
					) : null}
				</View>
				<View className="min-w-1">
					{hasSessionStarted ? (
						<TouchableOpacity
							onPress={skip}
							className="bg-slate-200 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<SkipForward color="#374151" />
						</TouchableOpacity>
					) : null}
				</View>
			</View>
		</SafeAreaView>
	);
}
