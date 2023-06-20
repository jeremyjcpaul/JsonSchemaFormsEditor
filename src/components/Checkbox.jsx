import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";

const Checkbox = ({ status, onChange }) => {
	const isChecked = status === 1;
	const isHalfChecked = status === 0.5;

	const checkboxRef = useRef(null);

	useLayoutEffect(() => {
		const checkboxDOM = checkboxRef?.current;
		checkboxDOM && (checkboxDOM.indeterminate = isHalfChecked);
	});

	return (
		<div className="Checkbox">
			<input
				className="checkboxDOM"
				type="checkbox"
				checked={isChecked}
				onChange={onChange}
				ref={checkboxRef}
			/>
		</div>
	);
};

Checkbox.propTypes = {
	status: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Checkbox;
