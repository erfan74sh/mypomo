import { View } from "react-native";
import { Fragment } from "react";

interface Props {
	totalIntervals: number;
	currentInterval: number;
	curentState: "focus" | "shortBreak" | "longBreak";
}

const IntervalTracker = ({
	totalIntervals,
	currentInterval,
	curentState,
}: Props) => {
	const generateTrackerState = (interval: number, state: 0 | 1) => {
		if (interval < currentInterval) {
			return "finished";
		} else if (interval === currentInterval) {
			if (curentState === "focus") {
				if (state === 0) {
					return "active";
				} else {
					return "none";
				}
			} else {
				if (state === 0) {
					return "finished";
				} else {
					return "active";
				}
			}
		} else {
			return "none";
		}
	};

	return (
		<View className="flex-row items-center justify-center gap-x-2">
			{Array.from({ length: totalIntervals }, (_, index) => (
				<Fragment key={index}>
					<View
						className={`w-6 h-6 rounded-full border-2 ${
							generateTrackerState(index + 1, 0) === "finished"
								? "bg-sky-700"
								: "bg-gray-300"
						} ${
							generateTrackerState(index + 1, 0) === "none"
								? "border-gray-300"
								: "border-sky-700"
						}`}
					/>
					<View
						className={`w-3 h-3 rounded-full border-2 ${
							generateTrackerState(index + 1, 1) === "finished"
								? "bg-sky-700"
								: "bg-gray-300"
						} ${
							generateTrackerState(index + 1, 1) === "none"
								? "border-gray-300"
								: "border-sky-700"
						}`}
					/>
				</Fragment>
			))}
		</View>
	);
};

export default IntervalTracker;
