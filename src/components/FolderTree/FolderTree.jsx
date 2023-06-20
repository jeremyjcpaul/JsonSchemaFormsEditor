import React from "react";
import PropTypes from "prop-types";
import useTreeState, {
	testData,
	findTargetNode,
	findAllTargetPathByProp,
	findTargetPathByProp,
} from "use-tree-state";

import TreeNode from "./TreeNode";
import ConfigContext from "./context";

import "./FolderTree.scss";

const FolderTree = ({
	data,
	onChange = console.log, // eslint-disable-line
	initCheckedStatus = "unchecked",
	initOpenStatus = "open",
	showCheckbox = true,
	indentPixels = 30,
	onNameClick = null,
}) => {
	const options = {
		initCheckedStatus,
		initOpenStatus,
	};
	const { treeState, reducers } = useTreeState({ data, options, onChange });
	const { checkNode, toggleOpen } = reducers;

	if (!treeState) return null;

	const configs = {
		handleCheck: checkNode,
		handleToggleOpen: toggleOpen,
		onNameClick,

		indentPixels,
		showCheckbox,
	};

	/* ----------
    - custom configs are passed down in context, which is same for each tree node
    - tree node specific data is passed recursively to each node, which is different for each node
                                                                                        ---------- */
	return (
		<div className="FolderTree">
			<ConfigContext.Provider value={configs}>
				<TreeNode key={treeState._id} path={[]} {...treeState} />
			</ConfigContext.Provider>
		</div>
	);
};

FolderTree.propTypes = {
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func,

	initCheckedStatus: PropTypes.string,
	initOpenStatus: PropTypes.string,
	indentPixels: PropTypes.number,
	onNameClick: PropTypes.func,
	showCheckbox: PropTypes.bool,
};

export {
	testData,
	findTargetNode,
	findAllTargetPathByProp,
	findTargetPathByProp,
};
export default FolderTree;
