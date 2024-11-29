/**
 * This file was generated from CustomizableMessagingView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListWidgetValue } from "mendix";

export interface CustomizableMessagingViewProps<Style> {
    name: string;
    style: Style[];
    data: ListValue;
    content?: ListWidgetValue;
    showSTB: boolean;
    colorSTB: string;
    pageSize: number;
    pageEndAction?: ActionValue;
    showBottomBar: boolean;
    attribute?: EditableValue<string>;
    bottomBarVisibility: DynamicValue<boolean>;
    placeholder: DynamicValue<string>;
    placeholderTextColor?: DynamicValue<string>;
    sendButtonAction?: ActionValue;
    mediaButtonAction?: ActionValue;
    bottomBarBGC: string;
    inputMaxHeight: number;
}

export interface CustomizableMessagingViewPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    data: {} | { caption: string } | { type: string } | null;
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    showSTB: boolean;
    colorSTB: string;
    pageSize: number | null;
    pageEndAction: {} | null;
    showBottomBar: boolean;
    attribute: string;
    bottomBarVisibility: string;
    placeholder: string;
    placeholderTextColor: string;
    onChangeAction: {} | null;
    sendButtonAction: {} | null;
    mediaButtonAction: {} | null;
    bottomBarBGC: string;
    inputMaxHeight: number | null;
}
