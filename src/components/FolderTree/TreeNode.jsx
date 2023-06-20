import React, { useContext } from "react";
import PropTypes from "prop-types";

import Checkbox from "../Checkbox";
import ConfigContext from "./context";
import {
	iconContainerClassName,
	iconClassName,
	AppIcons,
} from "../../utils/IconUtils";

const TreeNode = ({
	path,
	pathString,
	name,
	checked,
	isOpen,
	children,
	...restData
}) => {
	const nodeData = {
		path,
		name,
		checked,
		isOpen,
		...restData,
	};

	const {
		handleCheck,
		handleToggleOpen,

		indentPixels,
		onNameClick,
		showCheckbox,
	} = useContext(ConfigContext);

	const isFolder = !!children;

	const treeNodeStyle = {
		marginLeft: path.length * indentPixels,
	};

	let TypeIcon = AppIcons.File;
	let TypeIconType = "FileIcon";
	if (isFolder) {
		TypeIcon = isOpen ? AppIcons.FolderOpen : AppIcons.Folder;

		TypeIconType = isOpen ? "FolderOpenIcon" : "FolderIcon";
	}

	const handleCheckboxChange = (e) => {
		const newStatus = +e.target.checked;
		handleCheck(path, newStatus);
	};
	const toggleCheckbox = () => {
		handleCheck(path, checked ? 0 : 1);
	};

	// eslint-disable-next-line no-unused-vars
	const openMe = () => handleToggleOpen(path, true);
	const closeMe = () => handleToggleOpen(path, false);

	const handleNameClick = () => {
		const defaultOnClick = toggleCheckbox;
		if (onNameClick && typeof onNameClick === "function") {
			onNameClick({ defaultOnClick, nodeData });
		} else {
			defaultOnClick();
		}
	};

	const folderCaret = (
		<span className={iconContainerClassName("caretContainer")}>
			{isOpen ? (
				<AppIcons.CaretDown
					className={iconClassName("CaretDownIcon")}
					onClick={closeMe}
					nodeData={nodeData}
				/>
			) : (
				<AppIcons.CaretRight
					className={iconClassName("CaretRightIcon")}
					onClick={openMe}
					nodeData={nodeData}
				/>
			)}
		</span>
	);

	return (
		<>
			<div className="TreeNode" style={treeNodeStyle}>
				{showCheckbox && (
					<Checkbox status={checked} onChange={handleCheckboxChange} />
				)}

				{isFolder && folderCaret}

				<span className={iconContainerClassName("typeIconContainer")}>
					<TypeIcon
						className={iconClassName(TypeIconType)}
						onClick={toggleCheckbox}
						nodeData={nodeData}
					/>
				</span>

				<span
					className={iconContainerClassName("nameContainer")}
					onDoubleClick={isFolder ? handleNameClick : null}
					onClick={isFolder ? (isOpen ? closeMe : openMe) : handleNameClick}
				>
					{nodeData.name}
				</span>
			</div>

			{isFolder &&
				isOpen &&
				children.map((data, idx) => (
					<TreeNode key={data._id} path={[...path, idx]} {...data} />
				))}
		</>
	);
};

TreeNode.propTypes = {
	path: PropTypes.array.isRequired,
	pathString: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	checked: PropTypes.number.isRequired,
	isOpen: PropTypes.bool,
	children: PropTypes.array,
};

export default TreeNode;
