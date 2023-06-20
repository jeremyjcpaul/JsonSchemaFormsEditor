import { exec } from "child_process";

const asycGetGitBranchName = () =>
	new Promise((resolve, reject) => {
		return exec("git branch --show-current", (err, stdout, stderr) => {
			if (err) reject(`getGitBranchName Error: ${err}`);
			else if (typeof stdout === "string") resolve(stdout.trim());
		});
	});

export const asycGitCommit = (message) =>
	new Promise((resolve, reject) => {
		return exec('git commit -am "' + message + '"');
	});

export const checkGitBranchName = (callback, errorCallback) => {
	// get the current branch name
	getGitBranchName().then((branchName) => {
		if (["main", "master", "production"].indexOf(branchName) >= 0) {
			// we're on the main/production branch so throw an error
			return errorCallback(
				"You cannot run this application on the master branch!"
			);
		}
		// otherwise call the callback fn
		callback();
	});
};

export const getGitBranchName = async () => await asycGetGitBranchName();
