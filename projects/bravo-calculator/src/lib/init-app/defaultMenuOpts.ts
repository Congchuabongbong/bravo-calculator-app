import { EGroupMenu, EKeyCmdOption, EOptionCmd } from '../core/data-type/enum';

export const defaultMenuOpts = [
	{
		descCmd: 'Tùy chọn khi bấm phím Enter',
		keyCmd: EKeyCmdOption.Enter,
		optionsCmd: [
			{ value: true, name: 'Không', group: EGroupMenu.Default, optCmdKey: EOptionCmd.Nothing },
			{ value: false, name: 'Xóa tất cả', group: EGroupMenu.Group1, optCmdKey: EOptionCmd.ClearAll },
			{ value: false, name: 'Xóa', group: EGroupMenu.Group1, optCmdKey: EOptionCmd.Clear },
			{ value: false, name: 'Thu nhỏ máy tính', group: EGroupMenu.Group2, optCmdKey: EOptionCmd.HideCalculation },
			{ value: false, name: 'Chuyển cửa sổ', group: EGroupMenu.Group2, optCmdKey: EOptionCmd.SwitchWindow },
			{ value: false, name: 'Tính', group: EGroupMenu.Group3, optCmdKey: EOptionCmd.Calculate },
			{ value: false, name: 'Tính và dán kết quả', group: EGroupMenu.Group3, optCmdKey: EOptionCmd.CalculateAndPaste },
		],
	},
	{
		descCmd: 'Tùy chọn khi bấm phím Esc',
		keyCmd: EKeyCmdOption.Escape,
		optionsCmd: [
			{ value: false, name: 'Không', group: EGroupMenu.Default, optCmdKey: EOptionCmd.Nothing },
			{ value: false, name: 'Xóa tất cả', group: EGroupMenu.Group1, optCmdKey: EOptionCmd.ClearAll },
			{ value: true, name: 'Xóa', group: EGroupMenu.Group1, optCmdKey: EOptionCmd.Clear },
			{ value: false, name: 'Thu nhỏ máy tính', group: EGroupMenu.Group2, optCmdKey: EOptionCmd.HideCalculation },
			{ value: false, name: 'Chuyển cửa sổ', group: EGroupMenu.Group2, optCmdKey: EOptionCmd.SwitchWindow },
			{ value: false, name: 'Tính', group: EGroupMenu.Group3, optCmdKey: EOptionCmd.Calculate },
			{ value: false, name: 'Tính và dán kết quả', group: EGroupMenu.Group3, optCmdKey: EOptionCmd.CalculateAndPaste },
		],
	},
	{
		descCmd: 'Các tùy chọn khác',
		keyCmd: EKeyCmdOption.Other,
		optionsCmd: [{ value: true, name: 'Tự động tính khi chọn số', group: EGroupMenu.Group1, optCmdKey: EOptionCmd.AutoCalculate }],
	},
];
