function reorderColumnsByPreference(
	availableColumns: { key: string;[key: string]: any }[],
	preferredOrder: string[]
): { key: string;[key: string]: any }[] {
	const finalColumns: { key: string;[key: string]: any }[] = [];

	for (const key of preferredOrder) {
		const column = availableColumns.find(col => col.key === key);
		if (column) {
			finalColumns.push(column);
		} else {
			console.warn(
				`Field "${key}" in preferredOrder does not exist in availableColumns.`
			);
		}
	}

	for (const column of availableColumns) {
		if (!finalColumns.includes(column)) {
			finalColumns.push(column);
		}
	}

	return finalColumns;
}

export default reorderColumnsByPreference;
