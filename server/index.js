import express from "express";
import createError from "http-errors";
import bodyParser from "body-parser";
import { resolve } from "path";
import {
	asycGitCommit,
	checkGitBranchName,
	getGitBranchName,
} from "./gitInfo.mjs";
import { __dirname, appendKeyToFile, getAllFiles } from "./fileInfo.mjs";

const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(resolve(__dirname, "../build")));

// Handle GET requests to /files route
app.get("/branch_name", (req, res, next) => {
	getGitBranchName().then((branchName) => {
		res.status(200).json({ branch_name: branchName });
	});
});

// Handle GET requests to /files route
app.get("/files", (req, res, next) => {
	checkGitBranchName(
		() => {
			res.status(200).json({
				pathString: "SchemaForms",
				name: "SchemaForms",
				children: getAllFiles(req.get("relativeDir") || "./SchemaForms"),
			});
		},
		(errorMessage) => next(createError(400, errorMessage))
	);
});

app.use(bodyParser.json());
// Handle PUT requests to /files route
app.put("/files", (req, res, next) => {
	let data = req.body;
	checkGitBranchName(
		() => {
			let error = "";
			let files = data.files || [];
			let keyString = data.key || null;
			let valueString = data.value || null;

			// validate the input data
			if (files.length < 1) error = "You must select at least one file!";
			else if (keyString === null) error = "You must provide a key!";
			else if (valueString === null) error = "You must provide a value!";
			// send the error if we have one
			if (error.length > 0) next(createError(400, error));

			// loop the given files and process them
			let response = { messages: [] };
			let keyValuePair = keyString + ":" + valueString;
			let updatedFiles = [];
			files.forEach((file) => {
				const res = appendKeyToFile(file.path, keyValuePair);
				response.messages.push(res.outputMessage);
				if (res.appendedKeyValue) updatedFiles.push(" ".repeat(5) + file.path);
			});

			// commit a message to Git
			asycGitCommit(
				'"' +
					keyValuePair +
					'" was appended to each of the following JSON Schema Forms:\n' +
					updatedFiles.join(",\n") +
					"."
			);

			res.status(200).json(response);
		},
		(errorMessage) => next(createError(400, errorMessage))
	);
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
	res.sendFile(resolve(__dirname, "../build", "index.html"));
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			status: err.status || 500,
			message: err.message,
		},
	});
});

// Start the server on the given port
app.listen(PORT, console.log(`Server started on port ${PORT}`));
