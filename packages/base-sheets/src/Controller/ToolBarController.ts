import { BaseComponentRender, BaseComponentSheet } from '@univer/base-component';
import { Tools, BorderType, BorderStyleTypes, HorizontalAlign, VerticalAlign, WrapStrategy, DEFAULT_STYLES } from '@univer/core';
import { ColorPicker } from '@univer/style-universheet';
import { SheetPlugin } from '../SheetPlugin';
import { defaultLayout, ILayout } from '../View/UI/SheetContainer';

import { SelectionControl } from './Selection/SelectionController';
import {
    BORDER_LINE_CHILDREN,
    FONT_FAMILY_CHILDREN,
    FONT_SIZE_CHILDREN,
    HORIZONTAL_ALIGN_CHILDREN,
    MERGE_CHILDREN,
    TEXT_ROTATE_CHILDREN,
    TEXT_WRAP_CHILDREN,
    VERTICAL_ALIGN_CHILDREN,
} from '../View/UI/ToolBar/Const';
import styles from '../View/UI/ToolBar/index.module.less';
import { LineColor } from '../View/UI/Common/Line/LineColor';
import { SelectionModel } from '../Model';
import { IToolBarItemProps, ToolBarModel } from '../Model/ToolBarModel';
import { ToolBar } from '../View/UI/ToolBar';

interface BorderInfo {
    color: string;
    width: string;
}

/**
 *
 */
export class ToolBarController {
    private _toolBarModel: ToolBarModel;

    private _plugin: SheetPlugin;

    private _toolBarComponent: ToolBar;

    private _toolList: IToolBarItemProps[];

    private _lineColor: LineColor;

    Render: BaseComponentRender;

    private _borderInfo: BorderInfo; //存储边框信息

    constructor(plugin: SheetPlugin) {
        this._plugin = plugin;

        const pluginName = this._plugin.getPluginName();

        this.initRegisterComponent();

        const config =
            this._plugin.config.layout === 'auto'
                ? Tools.deepClone(defaultLayout.toolBarConfig)
                : Tools.deepMerge(defaultLayout.toolBarConfig, (this._plugin.config.layout as ILayout).toolBarConfig);

        this._borderInfo = {
            color: '#000',
            width: '1',
        };

        this._toolList = [
            {
                toolbarType: 1,
                tooltipLocale: 'toolbar.undo',
                customLabel: {
                    name: 'ForwardIcon',
                },
                show: config.undoRedo,
                onClick: () => {
                    this.setUndo();
                },
            },
            {
                toolbarType: 1,
                tooltipLocale: 'toolbar.redo',
                customLabel: {
                    name: 'BackIcon',
                },
                show: config.undoRedo,
                onClick: () => {
                    this.setRedo();
                },
            },

            // {
            //     toolbarType: 1,
            //     tooltipLocale: 'paintFormat',
            //     label: 'FormatIcon',
            //     show: config.paintFormat,
            // },
            // {
            //     toolbarType: 1,
            //     tooltipLocale: 'currencyFormat',
            //     label: 'MoneyIcon',
            //     show: config.currencyFormat,
            // },
            // {
            //     toolbarType: 1,
            //     tooltipLocale: 'percentageFormat',
            //     label: 'PercentIcon',
            //     show: config.percentageFormat,
            // },
            // {
            //     toolbarType: 1,
            //     tooltipLocale: 'numberDecrease',
            //     label: 'ReduceNumIcon',
            //     show: config.numberDecrease,
            // },
            // {
            //     toolbarType: 1,
            //     tooltipLocale: 'numberIncrease',
            //     label: 'AddNumIcon',
            //     show: config.numberIncrease,
            // },

            {
                type: 0,
                tooltipLocale: 'font',
                selectClassName: styles.selectLabelString,
                show: config.font,
                border: true,
                onClick: (fontFamily: string) => {
                    this._plugin.getObserver('onAfterChangeFontFamilyObservable')?.notifyObservers(fontFamily);
                },
                children: FONT_FAMILY_CHILDREN,
            },
            {
                type: 1,
                tooltipLocale: 'fontSize',
                label: String(DEFAULT_STYLES.fs),
                show: config.fontSize,
                onClick: (fontSize: number) => {
                    this._plugin.getObserver('onAfterChangeFontSizeObservable')?.notifyObservers(fontSize);
                },
                onKeyUp: (fontSize: number) => {
                    this._plugin.getObserver('onAfterChangeFontSizeObservable')?.notifyObservers(fontSize);
                },
                children: FONT_SIZE_CHILDREN,
            },
            {
                toolbarType: 1,
                tooltipLocale: 'bold',
                customLabel: {
                    name: 'BoldIcon',
                },
                show: config.bold,
                onClick: (isBold: boolean) => {
                    this._plugin.getObserver('onAfterChangeFontWeightObservable')?.notifyObservers(isBold);
                },
            },
            {
                toolbarType: 1,
                tooltipLocale: 'italic',
                customLabel: {
                    name: 'ItalicIcon',
                },
                show: config.italic,
                onClick: (isItalic: boolean) => {
                    this._plugin.getObserver('onAfterChangeFontItalicObservable')?.notifyObservers(isItalic);
                },
            },
            {
                toolbarType: 1,
                tooltipLocale: 'strikethrough',
                customLabel: {
                    name: 'DeleteLineIcon',
                },
                show: config.strikethrough,
                onClick: (isStrikethrough: boolean) => {
                    this._plugin.getObserver('onAfterChangeFontStrikethroughObservable')?.notifyObservers(isStrikethrough);
                },
            },
            {
                toolbarType: 1,
                tooltipLocale: 'underline',
                customLabel: {
                    name: 'UnderLineIcon',
                },
                show: config.underline,
                onClick: (isItalic: boolean) => {
                    this._plugin.getObserver('onAfterChangeFontUnderlineObservable')?.notifyObservers(isItalic);
                },
            },
            {
                type: 2,
                tooltipLocale: 'textColor',
                customLabel: {
                    name: 'TextColorIcon',
                },
                show: config.textColor,
                onClick: (color: string) => {
                    this._plugin.getObserver('onAfterChangeFontColorObservable')?.notifyObservers(color);
                },
            },
            {
                type: 2,
                tooltipLocale: 'fillColor',
                customLabel: {
                    name: 'FillColorIcon',
                },
                show: config.fillColor,
                onClick: (color: string) => {
                    this._plugin.getObserver('onAfterChangeFontBackgroundObservable')?.notifyObservers(color);
                },
            },
            {
                type: 3,
                display: 1,
                show: config.border,
                onClick: (type) => {
                    // console.dir(type);
                    // console.dir(this._borderInfo);
                },
                children: [
                    ...BORDER_LINE_CHILDREN,
                    {
                        customLabel: {
                            name: pluginName + LineColor.name,
                        },
                        unSelectable: true,
                        className: styles.selectColorPickerParent,
                        children: [
                            {
                                customLabel: {
                                    name: pluginName + ColorPicker.name,
                                    props: { onClick: (color: string, e: MouseEvent) => this.handleLineColor(color, e) },
                                },
                                className: styles.selectColorPicker,
                                onClick: this.handleLineColor,
                            },
                        ],
                    },
                    // {
                    //     locale: 'borderLine.borderSize',
                    //     suffix: 'RightIcon',
                    //     value: 1,
                    //     unSelectable: true,
                    //     children: [
                    //         { locale: 'borderLine.borderNone', value: 0 },
                    //         { label: 'BorderThin', value: 1 },
                    //         { label: 'BorderHair', value: 2 },
                    //         { label: 'BorderDotted', value: 3 },
                    //         { label: 'BorderDashed', value: 4 },
                    //         { label: 'BorderDashDot', value: 5 },
                    //         { label: 'BorderDashDotDot', value: 6 },
                    //         { label: 'BorderMedium', value: 7 },
                    //         { label: 'BorderMediumDashed', value: 8 },
                    //         { label: 'BorderMediumDashDot', value: 9 },
                    //         { label: 'BorderMediumDashDotDot', value: 10 },
                    //         { label: 'BorderThick', value: 12 },
                    //     ],
                    // },
                ],
            },
            {
                type: 5,
                tooltipLocale: 'mergeCell',
                customLabel: {
                    name: 'MergeIcon',
                },
                show: config.mergeCell,
                onClick: (value: string) => {
                    this.setMerge(value);
                },
                children: MERGE_CHILDREN,
            },
            {
                type: 3,
                tooltipLocale: 'horizontalAlignMode',
                display: 1,
                show: config.horizontalAlignMode,
                onClick: (value: HorizontalAlign) => {
                    this.setHorizontalAlignment(value);
                },
                children: HORIZONTAL_ALIGN_CHILDREN,
            },
            {
                type: 3,
                tooltipLocale: 'verticalAlignMode',
                display: 1,
                show: config.verticalAlignMode,
                onClick: (value: VerticalAlign) => {
                    this.setVerticalAlignment(value);
                },
                children: VERTICAL_ALIGN_CHILDREN,
            },
            {
                type: 3,
                tooltipLocale: 'textWrapMode',
                display: 1,
                show: config.textWrapMode,
                onClick: (value: WrapStrategy) => {
                    this.setWrapStrategy(value);
                },
                children: TEXT_WRAP_CHILDREN,
            },
            {
                type: 3,
                tooltipLocale: 'textRotateMode',
                display: 1,
                show: config.textRotateMode,
                onClick: (value: number | string) => {
                    this.setTextRotation(value);
                },
                children: TEXT_ROTATE_CHILDREN,
            },
        ];

        this._toolBarModel = new ToolBarModel();
        this._toolBarModel.config = config;
        this._toolBarModel.toolList = this._toolList;

        this.init();
    }

    init() {
        this._plugin.getObserver('onAfterChangeFontFamilyObservable')?.add((value: string) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setFontFamily(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('ff', value);
            }
        });
        this._plugin.getObserver('onAfterChangeFontSizeObservable')?.add((value: number) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setFontSize(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('fs', value);
            }
        });
        this._plugin.getObserver('onAfterChangeFontWeightObservable')?.add((value: boolean) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setFontWeight(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('bl', value ? '1' : '0');
            }
        });
        this._plugin.getObserver('onAfterChangeFontItalicObservable')?.add((value: boolean) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setFontStyle(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('it', value ? '1' : '0');
            }
        });
        this._plugin.getObserver('onAfterChangeFontStrikethroughObservable')?.add((value: boolean) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setStrikeThrough(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('cl', value ? '1' : '0');
            }
        });
        this._plugin.getObserver('onAfterChangeFontUnderlineObservable')?.add((value: boolean) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setUnderline(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('un', value ? '1' : '0');
            }
        });
        this._plugin.getObserver('onAfterChangeFontColorObservable')?.add((value: string) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setFontColor(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('fc', value);
            }
        });
        this._plugin.getObserver('onAfterChangeFontBackgroundObservable')?.add((value: string) => {
            if (!this._plugin.getCellEditorControl().isEditMode) {
                this.setBackground(value);
            } else {
                this._plugin.getCellEditorControl().richText.cellTextStyle.updateFormat('bg', value);
            }
        });

        this._plugin.getObserver('onToolBarDidMountObservable')?.add((component) => {
            //初始化视图
            this._toolBarComponent = component;
            this.resetToolBarList();
        });

        this._plugin.getObserver('onLineColorDidMountObservable')?.add((component) => {
            //初始化视图
            this._lineColor = component;
        });

        this._plugin.context
            .getObserverManager()
            .getObserver('onAfterChangeUILocaleObservable', 'workbook')
            ?.add(() => {});

        // Monitor selection changes, update toolbar button status and values TODO: 根据不同的焦点对象，接受
        this._plugin.getObserver('onChangeSelectionObserver')?.add((selectionControl: SelectionControl) => {
            const currentCell = selectionControl.model.currentCell;

            if (currentCell) {
                let currentRangeData;

                if (currentCell.isMerged) {
                    const mergeInfo = currentCell.mergeInfo;

                    currentRangeData = {
                        startRow: mergeInfo.startRow,
                        endRow: mergeInfo.endRow,
                        startColumn: mergeInfo.startColumn,
                        endColumn: mergeInfo.endColumn,
                    };
                } else {
                    const { row, column } = currentCell;
                    currentRangeData = {
                        startRow: row,
                        endRow: row,
                        startColumn: column,
                        endColumn: column,
                    };
                }

                const cellData = this._plugin.getWorkbook().getActiveSheet().getRange(currentRangeData).getObjectValue({ isIncludeStyle: true });
            }
        });
    }

    initRegisterComponent() {
        const component = this._plugin.context.getPluginManager().getPluginByName<BaseComponentSheet>('ComponentSheet')!;
        const pluginName = this._plugin.getPluginName();
        this.Render = component.getComponentRender();
        const registerIcon = {
            ForwardIcon: this.Render.renderFunction('ForwardIcon'),
            BackIcon: this.Render.renderFunction('BackIcon'),
            BoldIcon: this.Render.renderFunction('BoldIcon'),
            ItalicIcon: this.Render.renderFunction('ItalicIcon'),
            DeleteLineIcon: this.Render.renderFunction('DeleteLineIcon'),
            UnderLineIcon: this.Render.renderFunction('UnderLineIcon'),
            TextColorIcon: this.Render.renderFunction('TextColorIcon'),
            FillColorIcon: this.Render.renderFunction('FillColorIcon'),
            MergeIcon: this.Render.renderFunction('MergeIcon'),
            TopBorderIcon: this.Render.renderFunction('TopBorderIcon'),
            BottomBorderIcon: this.Render.renderFunction('BottomBorderIcon'),
            LeftBorderIcon: this.Render.renderFunction('LeftBorderIcon'),
            RightBorderIcon: this.Render.renderFunction('RightBorderIcon'),
            NoneBorderIcon: this.Render.renderFunction('NoneBorderIcon'),
            FullBorderIcon: this.Render.renderFunction('FullBorderIcon'),
            OuterBorderIcon: this.Render.renderFunction('OuterBorderIcon'),
            InnerBorderIcon: this.Render.renderFunction('InnerBorderIcon'),
            StripingBorderIcon: this.Render.renderFunction('StripingBorderIcon'),
            VerticalBorderIcon: this.Render.renderFunction('VerticalBorderIcon'),
            LeftAlignIcon: this.Render.renderFunction('LeftAlignIcon'),
            CenterAlignIcon: this.Render.renderFunction('CenterAlignIcon'),
            RightAlignIcon: this.Render.renderFunction('RightAlignIcon'),
            TopVerticalIcon: this.Render.renderFunction('TopVerticalIcon'),
            CenterVerticalIcon: this.Render.renderFunction('CenterVerticalIcon'),
            BottomVerticalIcon: this.Render.renderFunction('BottomVerticalIcon'),
            OverflowIcon: this.Render.renderFunction('OverflowIcon'),
            BrIcon: this.Render.renderFunction('BrIcon'),
            CutIcon: this.Render.renderFunction('CutIcon'),
            TextRotateIcon: this.Render.renderFunction('TextRotateIcon'),
            TextRotateAngleUpIcon: this.Render.renderFunction('TextRotateAngleUpIcon'),
            TextRotateAngleDownIcon: this.Render.renderFunction('TextRotateAngleDownIcon'),
            TextRotateVerticalIcon: this.Render.renderFunction('TextRotateVerticalIcon'),
            TextRotateRotationUpIcon: this.Render.renderFunction('TextRotateRotationUpIcon'),
            TextRotateRotationDownIcon: this.Render.renderFunction('TextRotateRotationDownIcon'),
        };

        // 注册自定义组件
        this._plugin.registerComponent(pluginName + LineColor.name, LineColor);
        this._plugin.registerComponent(pluginName + ColorPicker.name, ColorPicker);
        for (let k in registerIcon) {
            this._plugin.registerComponent(k, registerIcon[k]);
        }
    }

    resetLocale(toolList: any[]) {
        const locale = this._plugin.context.getLocale();

        for (let i = 0; i < toolList.length; i++) {
            const item = toolList[i];
            if (item.tooltipLocale) {
                item.tooltip = locale.get(item.tooltipLocale);
            }
            if (item.locale) {
                item.label = locale.get(item.locale);
            }
            if (item.suffixLocale) {
                item.suffix = locale.get(item.suffixLocale);
            }
            if (item.children) {
                item.children = this.resetLocale(item.children);
            }
        }
        return toolList;
    }

    resetToolBarList() {
        const toolList = this.resetLocale(this._toolList);
        this._toolBarComponent.setToolBar(toolList);
    }

    setRedo() {
        this._plugin.getContext().getCommandManager().redo();
    }

    setUndo() {
        this._plugin.getContext().getCommandManager().undo();
    }

    setFontColor(value: string) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setFontColor(value);
    }

    setBackground(value: string) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setBackground(value);
    }

    setFontSize(value: number) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setFontSize(value);
    }

    setFontFamily(value: string) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setFontFamily(value);
    }

    setFontWeight(value: boolean) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setFontWeight(value);
    }

    setFontStyle(value: boolean) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setFontStyle(value);
    }

    setStrikeThrough(value: boolean) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setStrikeThrough(value);
    }

    setUnderline(value: boolean) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setUnderline(value);
    }

    setMerge(value: string) {
        const currentRange = this._plugin.getSelectionManager().getActiveRange();

        switch (value) {
            case 'all':
                currentRange?.merge();
                break;

            case 'vertical':
                currentRange?.mergeVertically();
                break;

            case 'horizontal':
                currentRange?.mergeAcross();
                break;

            case 'cancel':
                currentRange?.breakApart();
                break;

            default:
                break;
        }

        // update data
        this._plugin.getCanvasView().updateToSheet(this._plugin.getContext().getWorkBook().getActiveSheet()!);
        // update render
        // this._plugin.getMainComponent().makeDirty(true);
    }

    setHorizontalAlignment(value: HorizontalAlign) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setHorizontalAlignment(value);
    }

    setVerticalAlignment(value: VerticalAlign) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setVerticalAlignment(value);
    }

    setWrapStrategy(value: WrapStrategy) {
        this._plugin.getSelectionManager().getActiveRangeList()?.setWrapStrategy(value);
    }

    setTextRotation(value: number | string) {
        if (value === 'v') {
            this._plugin.getSelectionManager().getActiveRangeList()?.setVerticalText(1);
        } else {
            this._plugin
                .getSelectionManager()
                .getActiveRangeList()
                ?.setTextRotation(value as number);
        }
    }

    setBorder(type: BorderType, color: string, style: BorderStyleTypes) {
        const controls = this._plugin.getSelectionManager().getCurrentControls();

        if (controls && controls.length > 0) {
            controls?.forEach((control: SelectionControl) => {
                const model: SelectionModel = control.model;
                const range = {
                    startRow: model.startRow,
                    startColumn: model.startColumn,
                    endRow: model.endRow,
                    endColumn: model.endColumn,
                };

                this._plugin.getContext().getWorkBook().getActiveSheet().getRange(range).setBorderByType(type, color, style);
            });

            this._plugin.getCanvasView().updateToSheet(this._plugin.getContext().getWorkBook().getActiveSheet()!);
        }
    }

    // 改变边框线颜色
    handleLineColor(color: string, e: MouseEvent) {
        e.stopPropagation();
        this._lineColor.setColor(color);
        this._borderInfo.color = color;
    }

    addToolButton(config: IToolBarItemProps) {
        const index = this._toolList.findIndex((item) => item.name === config.name);
        if (index > -1) return;
        this._toolList.push(config);
        this.resetToolBarList();
    }
}
