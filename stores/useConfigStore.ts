import { create } from "zustand";

export interface PomodoroPattern {
	focusTime: number;
	shortBreakTime: number;
	longBreakTime: number;
	intervals: number;
}

interface State {
	pomodoroPattern: PomodoroPattern;
	// currentInterval: number;
	// currentState: "focus" | "shortBreak" | "longBreak";
	// timer: number;
	// timerState: "running" | "paused" | "idle";
}

interface Actions {
	setPomodoroPattern: (pattern: PomodoroPattern) => void;
	// setCurrentInterval: (interval: number) => void;
	// setCurrentState: (state: "focus" | "shortBreak" | "longBreak") => void;
	// setTimer: (time: number) => void;
	// setTimerState: (state: "running" | "paused" | "idle") => void;
}

const useConfigStore = create<State & Actions>()((set) => ({
	pomodoroPattern: {
		focusTime: 5,
		shortBreakTime: 3,
		longBreakTime: 8,
		intervals: 3,
	},
	// currentInterval: 0,
	// currentState: "focus",
	// timer: 0,
	// timerState: "idle",
	setPomodoroPattern: (pattern: PomodoroPattern) =>
		set({ pomodoroPattern: pattern }),
}));

export default useConfigStore;
