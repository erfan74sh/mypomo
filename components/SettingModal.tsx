import { View, Text, Modal, TextInput, Button } from "react-native";
import React from "react";
import useConfigStore from "@/stores/useConfigStore";
import { PomodoroPattern } from "@/stores/useConfigStore";
interface SettingModalProps {
	visible: boolean;
	onRequestClose: () => void;
	children?: any;
}

const SettingModal = ({
	visible,
	onRequestClose,
	children,
}: SettingModalProps) => {
	const pomodoroPattern = useConfigStore((state) => state.pomodoroPattern);
	const setPomodoroPattern = useConfigStore(
		(state) => state.setPomodoroPattern
	);

	const [pomodoroPatternInput, setPomodoroPatternInput] = React.useState({
		focusTime: pomodoroPattern.focusTime / 60,
		shortBreakTime: pomodoroPattern.shortBreakTime / 60,
		longBreakTime: pomodoroPattern.longBreakTime / 60,
		intervals: pomodoroPattern.intervals,
	});

	const onPomodoroPatternChange = (
		keyToChange: keyof PomodoroPattern,
		newVal: string
	) => {
		let newFormattedValue = Number(newVal);
		if (keyToChange !== "intervals") {
			newFormattedValue = newFormattedValue;
		}
		setPomodoroPatternInput((prevPattern) => ({
			...prevPattern,
			[keyToChange]: newFormattedValue,
		}));
	};

	const onSaveChanges = () => {
		const formatedObj = {
			focusTime: pomodoroPatternInput.focusTime * 60,
			shortBreakTime: pomodoroPatternInput.shortBreakTime * 60,
			longBreakTime: pomodoroPatternInput.longBreakTime * 60,
			intervals: pomodoroPatternInput.intervals,
		};
		setPomodoroPattern(formatedObj);
		onRequestClose();
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onRequestClose}
		>
			<View className="bg-gray-200 flex-1 m-10 p-5 rounded-2xl ">
				<View className=" gap-y-2">
					<View className="flex-row justify-between items-center">
						<Text>Focus Time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							// placeholder="Focus time"
							value={pomodoroPatternInput.focusTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("focusTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Short break time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="Short break time"
							value={pomodoroPatternInput.shortBreakTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("shortBreakTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Long break time</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="Long break time"
							value={pomodoroPatternInput.longBreakTime.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("longBreakTime", text)
							}
						/>
					</View>
					<View className="flex-row justify-between items-center">
						<Text>Intervals</Text>
						<TextInput
							className="inline-inputs"
							keyboardType="numeric"
							placeholder="intervals"
							value={pomodoroPatternInput.intervals.toString()}
							onChangeText={(text) =>
								onPomodoroPatternChange("intervals", text)
							}
						/>
					</View>
				</View>
				<View className="mt-4">
					<Button onPress={onSaveChanges} title="Save changes" />
				</View>
			</View>
		</Modal>
	);
};

export default SettingModal;
