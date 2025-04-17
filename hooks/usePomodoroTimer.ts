import { useEffect, useRef, useState } from "react";
import useConfigStore from "@/stores/useConfigStore";
import { useTimerStore } from "@/stores/timerStore";

type TimerState = "idle" | "running" | "paused";
type PomodoroPhase = "focus" | "shortBreak" | "longBreak";

const usePomodoroTimer = () => {
	const [remainingTime, setRemainingTime] = useState(0);
	const [currentInterval, setCurrentInterval] = useState(1);
	const [currentState, setCurrentState] = useState<PomodoroPhase>("focus");
	const [timerState, setTimerState] = useState<TimerState>("idle");
	const [showCycleCompleteModal, setShowCycleCompleteModal] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const focusTime = useConfigStore((store) => store.focusTime);
	const shortBreakTime = useConfigStore((store) => store.shortBreakTime);
	const longBreakTime = useConfigStore((store) => store.longBreakTime);
	const intervals = useConfigStore((store) => store.intervals);
	const autoStartBreak = useConfigStore((store) => store.autoStartBreak);

	const { notificationId, setTimer, clearTimer } = useTimerStore();

	// Set duaration based on pomodoroPhase
	const resetDuration = () => {
		const timeMap = {
			focus: focusTime,
			shortBreak: shortBreakTime,
			longBreak: longBreakTime,
		};
		setRemainingTime(Number(timeMap[currentState]));
	};

	// Start Timer
	const start = async () => {
		if (timerRef.current) clearInterval(timerRef.current);
		setTimerState("running");
		const now = new Date();
		const end = new Date(now.getTime() + remainingTime * 1000);

		const notifId = "";
		// const notifId = await schedulePomodoroNotification(end);
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

	const skip = async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		await cancel();
		setTimerState("idle");

		if (currentState === "longBreak") {
			setShowCycleCompleteModal(true);
		} else {
			goToNextPhase();
		}
	};

	// Resume Timer
	const resume = async () => {
		if (!timerRef.current && remainingTime > 0) {
			setTimerState("running");
			const now = new Date();
			const end = new Date(now.getTime() + remainingTime * 1000);
			const notifId = "";
			// const notifId = await schedulePomodoroNotification(end);
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
		setShowCycleCompleteModal(false);
	};

	// Cancel Notification
	const cancel = async () => {
		if (notificationId) {
			// await cancelPomodoroNotification(notificationId);
			clearTimer();
		}
	};

	// On Timer End
	useEffect(() => {
		if (remainingTime <= 0 && timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
			setTimerState("idle");
			if (currentState === "longBreak") {
				setShowCycleCompleteModal(true);
			} else {
				goToNextPhase();
			}
		}
	}, [remainingTime]);

	const goToNextPhase = () => {
		if (currentState === "focus") {
			if (currentInterval >= intervals) {
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
	}, [currentState, focusTime, shortBreakTime, longBreakTime]);

	useEffect(() => {
		(async () => {
			if (
				autoStartBreak &&
				currentState !== "focus" &&
				timerState === "idle" &&
				remainingTime > 0
			) {
				await start();
			}
		})();
	}, [currentState, remainingTime, timerState]);

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
		skip,
		startNextCycle,
		setShowCycleCompleteModal,
	};
};

export default usePomodoroTimer;
