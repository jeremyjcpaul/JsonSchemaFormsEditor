/**
 * Retrieves JSON schema form file info from the API.
 * @returns object
 */
export const getFiles = async () => {
	try {
		const files = await fetch("/files").then(
			(res) => res.json(), // success! return the data
			(err) => {
				// something bad happened, show the error
				return { error: err.data };
			}
		);
		return files;
	} catch (error) {
		return {
			error: {
				status: error.status,
				message: error.message,
			},
		};
	}
};

/**
 * We receive files selected data in a format specific for the web components used.
 * We need to change this into API-ready JSON.
 */
const parseFiles = (tree, selectedFiles) => {
	if (tree && tree.checked > 0 && tree.children && tree.children.length > 0) {
		// the tree's root has children to process
		tree.children.forEach((entity) => {
			if (entity.children && entity.children.length > 0) {
				// we're currently looking at a folder
				selectedFiles = parseFiles(entity, selectedFiles);
			} else if (entity.checked === 1) {
				// we have a selected file
				selectedFiles.push({ name: entity.name, path: entity.pathString });
			}
		});
	}
	return selectedFiles;
};

/**
 * Update the given files by adding the key/value pair to each of the files.
 * @param {object[]} files
 * @param {string} key
 * @param {string} value
 * @returns object
 */
export const putFiles = async (files, key, value) => {
	try {
		const selectedFiles = [];
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				files: parseFiles(files, selectedFiles),
				key: key,
				value: value,
			}),
		};

		const response = await fetch("/files", requestOptions).then(
			(res) => res.json(), // success! return the API response
			(err) => {
				// something bad happened, show the error
				return { error: err.data };
			}
		);

		return response;
	} catch (error) {
		return {
			error: {
				status: error.status,
				message: error.message,
			},
		};
	}
};
