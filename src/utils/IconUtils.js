import React from "react";
import {
	FaRegFile,
	FaRegFolder,
	FaRegFolderOpen,
	FaCaretRight,
	FaCaretDown,
} from "react-icons/fa/index.esm.js";

export const iconContainerClassName = (className) =>
	`iconContainer ${className}`;
export const iconClassName = (className) => `icon ${className}`;

const getIconByClass =
	(Icon) =>
	(
		{ className, onClick } // eslint-disable-line
	) =>
		<Icon className={className} onClick={onClick} />;

export const AppIcons = {
	File: getIconByClass(FaRegFile),
	Folder: getIconByClass(FaRegFolder),
	FolderOpen: getIconByClass(FaRegFolderOpen),
	CaretRight: getIconByClass(FaCaretRight),
	CaretDown: getIconByClass(FaCaretDown),
};
