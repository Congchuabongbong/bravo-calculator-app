export interface ICommand {
	execute: () => void;
	undo?: () => void;
	cancel?: () => void;
}
