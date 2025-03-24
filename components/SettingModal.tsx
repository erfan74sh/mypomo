import { View, Text, Modal } from "react-native";
import React from "react";

interface SettingModalProps {
	visible: boolean;
	onRequestClose: () => void;
	children: any;
}

const SettingModal = ({
	visible,
	onRequestClose,
	children,
}: SettingModalProps) => {
	console.log({ visible });
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onRequestClose}
		>
			<View className="bg-gray-200 flex-1 m-10 p-5 rounded-2xl ">
				{children}
			</View>
		</Modal>
	);
};

export default SettingModal;
