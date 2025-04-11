import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TimerState = {
	startTime: string | null;
	duration: number; // in minutes,
	notificationId: string | null;
	setTimer: (
		startTime: string,
		duration: number,
		notificationId: string
	) => void;
	clearTimer: () => void;
};

export const useTimerStore = create<TimerState>()(
	persist(
		(set) => ({
			startTime: null,
			duration: 0,
			notificationId: null,
			setTimer: (startTime, duration, notificationId) =>
				set({ startTime, duration, notificationId }),
			clearTimer: () =>
				set({ startTime: null, duration: 0, notificationId: null }),
		}),
		{
			name: "pomodoro-timer-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
