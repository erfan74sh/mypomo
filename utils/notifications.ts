import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import * as Linking from "expo-linking";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export async function schedulePomodoroNotification(endTime: Date) {
	console.log({ endTime });
	const notificationId = await Notifications.scheduleNotificationAsync({
		content: {
			title: "Pomodoro Timer",
			body: "The timer has ended!",
			data: { type: "pomodoro" },
		},
		trigger: {
			date: endTime,
			type: Notifications.SchedulableTriggerInputTypes.DATE,
		},
	});
	console.log("notificationId", notificationId);
	return notificationId;
}

export async function requestNotificationPermissions() {
	const { status, canAskAgain } = await Notifications.getPermissionsAsync();
	if (status !== "granted" && !canAskAgain) {
		// User has already denied permission and cannot ask again
		Alert.alert(
			"permission required",
			"To receive Pomodoro alerts, please enable notifications in settings.",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Settings", onPress: () => Linking.openSettings() },
			]
		);
	} else {
		await Notifications.requestPermissionsAsync();
	}
}

export async function cancelPomodoroNotification(notificationId: string) {
	await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function getNotifications() {
	const notifs = await Notifications.getAllScheduledNotificationsAsync();
	return notifs;
}
