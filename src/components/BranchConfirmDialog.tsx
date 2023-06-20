import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export interface BranchConfirmDialogProps {
	branchName?: string;
	enabled: boolean;
	onClickOk: () => void;
}

export default function BranchConfirmDialog(props: BranchConfirmDialogProps) {
	const [open, setOpen] = React.useState(false);
	const [branchName, setBranchName] = React.useState(false);

	const handleGetBranchName = async () => {
		const branchName =
			props.branchName ||
			(await fetch("/branch_name")
				.then((res) => res.json())
				.then((json) => json.branch_name));
		setBranchName(branchName);
	};
	const handleClickOpen = () => {
		handleGetBranchName();
		setOpen(true);
	};
	const handleClose = () => setOpen(false);
	const handleOk = () => {
		props.onClickOk();
		setOpen(false);
	};

	return (
		<div>
			<Button
				disabled={!props.enabled}
				variant="outlined"
				onClick={handleClickOpen}
			>
				Update JSON files
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You are on
						{" " +
							(branchName
								? 'branch "' + branchName + '"'
								: "an unknown branch") +
							", "}
						do you wish to continue?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleOk} autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
