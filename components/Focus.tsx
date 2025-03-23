import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/utils/colors";
import { TextInput } from "react-native-paper";

const Focus = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Focus</Text>

			<View style={styles.inputContainer}>
				<TextInput label="What would you like to focus on?" value="" />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	text: {
		color: colors.white,
	},
	inputContainer: {
		// flex: 1,
	},
});

export default Focus;
