import { Fragment, useEffect, useState } from "react";
import { Alert, Grid, TextField } from "@mui/material";

import "./App.scss";
import BranchConfirmDialog from "./components/BranchConfirmDialog";
import FolderTree from "./components/FolderTree/FolderTree";
import OutputView from "./components/OutputView";
import { getFiles, putFiles } from "./utils/filesApi";

function App() {
	const [errorMessage, setErrorMessage] = useState<any>(null);
	const [files, setData] = useState<any>(null);
	const [treeState, setTreeState] = useState<any>(null);
	const [keyInput, setKey] = useState<string>("KEY");
	const [valueInput, setValue] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [outputMessages, setOutputMessages] = useState<string>("");

	const checkSubmitButton = () => {
		setSubmitEnabled(
			treeState &&
				treeState.checked > 0 &&
				keyInput.length > 0 &&
				valueInput.length > 0
		);
	};

	const onTreeStateChange = (state: any, event: Event) => {
		setTreeState(state);
		checkSubmitButton();
	};

	const onClickUpdateFiles = () => {
		// clear the output messages
		setOutputMessages("");

		const handle = async () => {
			const response = await putFiles(treeState, keyInput, valueInput);
			if (response.error) {
				// something bad happened, show the error
				setErrorMessage(response.error.message);
			} else {
				// success! show the response
				if (response.messages) setOutputMessages(response.messages.join("\n"));
				setErrorMessage(null); // clear any error messages
			}
		};
		handle();
	};

	useEffect(() => {
		const handle = async () => {
			const files = await getFiles();
			if (files.error) {
				// something bad happened, show the error
				setErrorMessage(files.error.message);
			} else {
				// success! set the data
				setData(files);
				setErrorMessage(null); // clear any error messages
			}
		};
		handle();
	}, []);

	return files === null ? (
		<Fragment>
			<Grid
				container
				justifyContent={"center"}
				spacing={1}
				className={"infoscreen"}
			>
				<Grid item sm={12}>
					{errorMessage !== null ? "Error: " + errorMessage : "Loading&hellip;"}
				</Grid>
			</Grid>
		</Fragment>
	) : (
		<Fragment>
			<Grid
				container
				justifyContent={"center"}
				spacing={2}
				className={"container"}
			>
				<Grid item sm={12}>
					<Alert
						className={errorMessage !== null ? "" : "hidden"}
						severity="error"
					>
						Error: {errorMessage}
					</Alert>
				</Grid>
				<Grid item sm={6}>
					<FolderTree data={files} onChange={onTreeStateChange} />
				</Grid>
				<Grid item sm={6}>
					<Grid container spacing={2}>
						<Grid item sm={12}>
							<TextField
								id="keyField"
								name="key"
								label="Key"
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setKey(event.target.value);
									checkSubmitButton();
								}}
								value={keyInput}
								variant="filled"
								required
							/>
							&nbsp;
							<TextField
								id="valueField"
								name="value"
								label="Value"
								value={valueInput}
								variant="filled"
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setValue(event.target.value);
									checkSubmitButton();
								}}
								required
							/>
						</Grid>
						<Grid item sm={12}>
							<BranchConfirmDialog
								enabled={submitEnabled}
								onClickOk={onClickUpdateFiles}
							/>
							<OutputView text={outputMessages} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Fragment>
	);
}

export default App;
