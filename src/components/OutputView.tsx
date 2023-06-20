import { TextField, styled } from "@mui/material";
import * as React from "react";

const OutputTextField = styled(TextField)({
	"& input:valid:focus + fieldset": {
		borderLeftWidth: 4,
		padding: "4px !important", // override inline-style
	},
});

export interface OutputViewProps {
	text: string;
	label?: string;
	id?: string;
	name?: string;
}

export default function OutputView(props: OutputViewProps) {
	return (
		<div>
			<OutputTextField
				id={props.id || "outputField"}
				name={props.name || "output"}
				label={props.label || "Output"}
				variant="outlined"
				multiline
				rows={10}
				fullWidth
				disabled
				value={props.text}
			/>
		</div>
	);
}
