import fs from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

/**
 * Attempts to append the given key/value pair to the JSON file at the given path.
 * @param {string} filePath
 * @param {string} keyValuePair
 * @returns string
 */
export const appendKeyToFile = function (filePath, keyValuePair) {
	//check if file exist
	if (!fs.existsSync(filePath)) {
		//create new file if not exist
		fs.closeSync(fs.openSync(filePath, "w"));
	}

	// read file
	const file = fs.readFileSync(filePath);

	const response = {
		appendedKeyValue: false,
		outputMessage: "",
	};

	// check if file is empty
	if (file.length === 0) {
		response.outputMessage = '"' + filePath + '" is an empty file.';
		return response;
	}

	// parse the JSON file
	const json = JSON.parse(file.toString());

	if (json.label) {
		// found expected label parameter
		if (json.label.control) {
			// found expected control parameter
			if (json.label.control.indexOf(keyValuePair) >= 0) {
				// key already exists in the file
				response.outputMessage =
					'Key/value pair already exists in "' + filePath + '".';
			} else {
				// append the key/value into the file
				json.label.control.push(keyValuePair);
				fs.writeFileSync(filePath, JSON.stringify(json));
				// update the response
				response.appendedKeyValue = true;
				response.outputMessage =
					'Key/value pair appended to "' + filePath + '".';
			}
		} else {
			// return error message
			response.outputMessage =
				'"label.control" not found in "' + filePath + '"';
		}
	} else {
		// return error message
		response.outputMessage = '"label" not found in "' + filePath + '"';
	}

	return response;
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
