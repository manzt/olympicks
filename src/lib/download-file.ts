export function downloadFile(
	contents: string,
	options: {
		name: string;
		type: string;
	},
) {
	let file = new File([contents], options.name, { type: options.type });
	let url = URL.createObjectURL(file);
	let a = document.createElement("a");
	a.href = url;
	a.download = file.name;
	a.click();
	URL.revokeObjectURL(url);
}
