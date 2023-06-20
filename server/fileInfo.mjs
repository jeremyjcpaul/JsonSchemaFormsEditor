import fs from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

/**
 * Attempts to append the given key/value pair to the JSON file at the given path.
 * @param {string} filePath
 * @param {string} key
 * @param {string} value
 * @returns string
 */
export const appendKeyToFile = function (filePath, key, value) {
	//check if file exist
	if (!fs.existsSync(filePath)) {
		//create new file if not exist
		fs.closeSync(fs.openSync(filePath, "w"));
	}

	// read file
	const file = fs.readFileSync(filePath);

	// check if file is empty
	if (file.length === 0) return '"' + filePath + '" is an empty file.';

	// parse the JSON file
	const json = JSON.parse(file.toString());

	if (json.label) {
		// found expected label parameter
		if (json.label.control) {
			// found expected control parameter
			let keyValuePair = key + ":" + value;
			if (json.label.control.indexOf(keyValuePair) >= 0) {
				// key already exists in the file
				return {
					outputMessage: 'Key/value pair already exists in "' + filePath + '".',
				};
			} else {
				// append the key/value into the file
				json.label.control.push(keyValuePair);
				fs.writeFileSync(filePath, JSON.stringify(json));
				return {
					gitCommitMessage: keyValuePair + ' appended to "' + filePath + '".',
					outputMessage: 'Key/value pair appended to "' + filePath + '".',
				};
			}
		} else {
			// return error message
			return {
				outputMessage: '"label.control" not found in "' + filePath + '"',
			};
		}
	} else {
		// return error message
		return {
			outputMessage: '"label" not found in "' + filePath + '"',
		};
	}
};

/**
 * Gets the contents of the given directory and return as JSON.
 * @param {string} dirPath
 * @param {object[]} result
 * @returns object[]
 */
export const getAllFiles = function (dirPath, result) {
	// read the contents of the given path
	var files = fs.readdirSync(dirPath);
	result = result || [];

	files.forEach(function (entityName) {
		var entityPath = join(dirPath, "/", entityName);
		var entity = {
			pathString: entityPath,
			name: entityName,
		};

		if (fs.statSync(entityPath).isDirectory()) {
			// got a folder so grab it's children by recursing this function
			entity.children = getAllFiles(entityPath, []);
		} else if (extname(entityName).toLowerCase() !== ".json") {
			// skip files that aren't JSON
			return;
		}
		// add the file/folder to the results array
		result.push(entity);
	});

	return result;
};
