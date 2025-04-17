import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface State {
	focusTime: number;
	shortBreakTime: number;
	longBreakTime: number;
	intervals: number;
	autoStartBreak: boolean;
}
interface Actions {
	setPomodoroPattern: (pattern: State) => void;
}

const useConfigStore = create<State & Actions>()(
	persist(
		(set) => ({
			focusTime: 25 * 60,
			shortBreakTime: 5 * 60,
			longBreakTime: 15 * 60,
			intervals: 3,
			autoStartBreak: false,

			setPomodoroPattern: (config) => set({ ...config }),
		}),
		{
			name: "pomodoro-pattern-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
export default useConfigStore;
