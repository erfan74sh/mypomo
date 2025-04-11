export function formatTime(second: Number): Array<string> {
	const totalSeconds = Number(second);
	const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
	const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
	return [minutes, seconds];
}
