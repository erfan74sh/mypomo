import {
	View,
	Text,
	Modal,
	TextInput,
	Button,
	Switch,
	TouchableOpacity,
} from "react-native";
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
	const focusTime = useConfigStore((state) => state.focusTime);
	const shortBreakTime = useConfigStore((state) => state.shortBreakTime);
	const longBreakTime = useConfigStore((state) => state.longBreakTime);
	const intervals = useConfigStore((state) => state.intervals);
	const autoStartBreak = useConfigStore((state) => state.autoStartBreak);
	const setPomodoroPattern = useConfigStore(
		(state) => state.setPomodoroPattern
	);

	const [pomodoroPatternInput, setPomodoroPatternInput] = React.useState({
		focusTime: focusTime / 60,
		shortBreakTime: shortBreakTime / 60,
		longBreakTime: longBreakTime / 60,
		intervals: intervals,
		autoStartBreak: autoStartBreak,
	});

	const onSaveChanges = () => {
		const formatedObj = {
			focusTime: pomodoroPatternInput.focusTime * 60,
			shortBreakTime: pomodoroPatternInput.shortBreakTime * 60,
			longBreakTime: pomodoroPatternInput.longBreakTime * 60,
			intervals: pomodoroPatternInput.intervals,
			autoStartBreak: pomodoroPatternInput.autoStartBreak,
		};
		setPomodoroPattern(formatedObj);
		closeModalHandler();
	};

	const resetValues = () => {
		setPomodoroPatternInput({
			focusTime: focusTime / 60,
			shortBreakTime: shortBreakTime / 60,
			longBreakTime: longBreakTime / 60,
			intervals: intervals,
			autoStartBreak: autoStartBreak,
		});
	};

	const closeModalHandler = () => {
		onRequestClose();
		resetValues();
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={closeModalHandler}
		>
			<View className="flex-1 justify-center items-center bg-black/50">
				<View className="bg-slate-200 p-7 rounded-xl w-4/6 min-w-72 max-w-96">
					<View className=" gap-y-2">
						<View className="flex-row justify-between items-center">
							<Text>Focus Time</Text>
							<TextInput
								className="inline-inputs"
								keyboardType="numeric"
								// placeholder="Focus time"
								value={pomodoroPatternInput.focusTime.toString()}
								onChangeText={(text) =>
									setPomodoroPatternInput((prevPattern) => ({
										...prevPattern,
										focusTime: Number(text),
									}))
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
									setPomodoroPatternInput((prevPattern) => ({
										...prevPattern,
										shortBreakTime: Number(text),
									}))
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
									setPomodoroPatternInput((prevPattern) => ({
										...prevPattern,
										longBreakTime: Number(text),
									}))
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
									setPomodoroPatternInput((prevPattern) => ({
										...prevPattern,
										intervals: Number(text),
									}))
								}
							/>
						</View>
						<View className="flex-row justify-between items-center">
							<Text>Auto start Breaks</Text>
							<Switch
								value={pomodoroPatternInput.autoStartBreak}
								onValueChange={() =>
									setPomodoroPatternInput((prevPattern) => ({
										...prevPattern,
										autoStartBreak: !pomodoroPatternInput.autoStartBreak,
									}))
								}
								trackColor={{
									true: "#0369a1",
									false: "#d1d5db",
								}}
								thumbColor={
									pomodoroPatternInput.autoStartBreak ? "#fff" : "#f4f3f4"
								}
							/>
						</View>
					</View>
					<View className="gap-y-2 mt-6">
						<TouchableOpacity
							onPress={onSaveChanges}
							className="bg-sky-700 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<Text className="font-semibold text-white">Save changes</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={closeModalHandler}
							className=" bg-gray-100 border-2 border-sky-700 p-4 rounded-md flex-row gap-x-1 items-center justify-center"
						>
							<Text className="font-semibold text-sky-700">Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default SettingModal;
