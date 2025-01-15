/**
 * This file was generated from CustomizableMessagingView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, NativeImage, ListWidgetValue } from "mendix";

export interface CustomizableMessagingViewProps<Style> {
    name: string;
    style: Style[];
    data: ListValue;
    content?: ListWidgetValue;
    showSTB: boolean;
    colorSTB: string;
    pageSize: number;
    pageEndAction?: ActionValue;
    scrollToBottomBtn: DynamicValue<NativeImage>;
    showBottomBar: boolean;
    attribute?: EditableValue<string>;
    bottomBarVisibility: DynamicValue<boolean>;
    placeholder: DynamicValue<string>;
    placeholderTextColor?: DynamicValue<string>;
    onChangeAction?: ActionValue;
    keyPressTimeout: number;
    sendButtonAction?: ActionValue;
    mediaButtonAction?: ActionValue;
    bottomBarBGC: string;
    inputMaxHeight: number;
    textMaxLength: number;
    mediaBtnIcon: DynamicValue<NativeImage>;
    sendIcon: DynamicValue<NativeImage>;
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
    scrollToBottomBtn: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    showBottomBar: boolean;
    attribute: string;
    bottomBarVisibility: string;
    placeholder: string;
    placeholderTextColor: string;
    onChangeAction: {} | null;
    keyPressTimeout: number | null;
    sendButtonAction: {} | null;
    mediaButtonAction: {} | null;
    bottomBarBGC: string;
    inputMaxHeight: number | null;
    textMaxLength: number | null;
    mediaBtnIcon: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    sendIcon: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
}
