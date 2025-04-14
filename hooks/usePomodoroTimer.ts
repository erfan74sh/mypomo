import { View, Text, Vibration } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import useConfigStore from "@/stores/useConfigStore";
import { useTimerStore } from "@/stores/timerStore";
import {
	cancelPomodoroNotification,
	schedulePomodoroNotification,
} from "@/utils/notifications";

type TimerState = "idle" | "running" | "paused";
type PomodoroPhase = "focus" | "shortBreak" | "longBreak";

const usePomodoroTimer = () => {
	const [remainingTime, setRemainingTime] = React.useState(0);
	const [currentInterval, setCurrentInterval] = useState(1);
	const [currentState, setCurrentState] = useState<PomodoroPhase>("focus");
	const [timerState, setTimerState] = useState<TimerState>("idle");
	const [showCycleCompleteModal, setShowCycleCompleteModal] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const pomodoroPattern = useConfigStore((store) => store.pomodoroPattern);

	const { startTime, duration, notificationId, setTimer, clearTimer } =
		useTimerStore();

	// Set duaration based on pomodoroPhase
	const resetDuration = () => {
		const timeMap = {
			focus: pomodoroPattern.focusTime,
			shortBreak: pomodoroPattern.shortBreakTime,
			longBreak: pomodoroPattern.longBreakTime,
		};
		setRemainingTime(Number(timeMap[currentState]));
	};

	// Start Timer
	const start = async () => {
		if (timerRef.current) clearInterval(timerRef.current);

		setTimerState("running");
		const now = new Date();
		const end = new Date(now.getTime() + remainingTime * 1000);

		const notifId = await schedulePomodoroNotification(end);
		setTimer(now.toISOString(), remainingTime / 60, notifId);

		timerRef.current = setInterval(() => {
			setRemainingTime((prev) => prev - 1);
		}, 1000);
	};

	// Pause Timer
	const pause = async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		await cancel();
		setTimerState("paused");
	};

	// Resume Timer
	const resume = async () => {
		if (!timerRef.current && remainingTime > 0) {
			setTimerState("running");
			const now = new Date();
			const end = new Date(now.getTime() + remainingTime * 1000);
			const notifId = await schedulePomodoroNotification(end);
			setTimer(now.toISOString(), remainingTime / 60, notifId);

			timerRef.current = setInterval(() => {
				setRemainingTime((prev) => prev - 1);
			}, 1000);
		}
	};

	// Reset application state
	const reset = async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		await cancel();
		setTimerState("idle");
		setCurrentState("focus");
		setCurrentInterval(1);
		resetDuration();
	};

	// Cancel Notification
	const cancel = async () => {
		if (notificationId) {
			await cancelPomodoroNotification(notificationId);
			clearTimer();
		}
	};

	// On Timer End
	useEffect(() => {
		if (remainingTime <= 0 && timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
			Vibration.vibrate();
			setTimerState("idle");

			if (currentState === "longBreak") {
				setShowCycleCompleteModal(true); // ✅ show modal here
			} else {
				goToNextPhase(); // ✅ keep this focused
			}
		}
	}, [remainingTime]);

	const goToNextPhase = () => {
		if (currentState === "focus") {
			if (currentInterval >= pomodoroPattern.intervals) {
				setCurrentState("longBreak");
			} else {
				setCurrentState("shortBreak");
			}
		} else if (currentState === "shortBreak") {
			setCurrentInterval((prev) => prev + 1);
			setCurrentState("focus");
		} else if (currentState === "longBreak") {
			setCurrentInterval(1);
			setCurrentState("focus");
		}
	};

	// On state Change, reset duration
	useEffect(() => {
		resetDuration();
	}, [currentState, pomodoroPattern]);

	const startNextCycle = async () => {
		setCurrentInterval(1);
		setCurrentState("focus");
		resetDuration();
		setShowCycleCompleteModal(false);
		await start(); // start next cycle right away
	};

	// Time interval clean up
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	return {
		timerState,
		currentState,
		currentInterval,
		remainingTime,
		showCycleCompleteModal,
		setRemainingTime,
		start,
		pause,
		resume,
		reset,
		startNextCycle,
	};
};

export default usePomodoroTimer;
