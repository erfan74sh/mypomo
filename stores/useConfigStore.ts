import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface PomodoroPattern {
	focusTime: number;
	shortBreakTime: number;
	longBreakTime: number;
	intervals: number;
}

interface State {
	pomodoroPattern: PomodoroPattern;
}

interface Actions {
	setPomodoroPattern: (pattern: PomodoroPattern) => void;
}

const useConfigStore = create<State & Actions>()(
	persist(
		(set) => ({
			pomodoroPattern: {
				focusTime: 25 * 60,
				shortBreakTime: 5 * 60,
				longBreakTime: 15 * 60,
				intervals: 3,
			},

			setPomodoroPattern: (pattern: PomodoroPattern) =>
				set({ pomodoroPattern: { ...pattern } }),
		}),
		{
			name: "pomodoro-pattern-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
export default useConfigStore;
