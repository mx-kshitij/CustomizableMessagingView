import { createElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, TextInputContentSizeChangeEventData, TextStyle, View, ViewStyle } from "react-native";
import { mergeNativeStyles, Style } from "@mendix/pluggable-widgets-tools";
// import { HelloWorld } from "./components/HelloWorld";
import { CustomizableMessagingViewProps } from "../typings/CustomizableMessagingViewProps";
import { ObjectItem, Option, ValueStatus } from "mendix";
import { Image } from "mendix/components/native/Image";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export interface StyleProps {
    scrollToBottomButtonPositionY: number;
    scrollToBottomButtonColor: string;
    bottomBarBackgroundColor: string;
}

// const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const CustomizableMessagingView = ({
    style,
    data,
    pageSize,
    content,
    showBottomBar,
    showSTB,
    colorSTB,
    pageEndAction,
    attribute,
    sendButtonAction,
    placeholder,
    placeholderTextColor,
    bottomBarVisibility,
    bottomBarBGC,
    mediaButtonAction,
    inputMaxHeight,
    onChangeAction,
    keyPressTimeout = 200,
    textMaxLength = 750,
    mediaBtnIcon,
    scrollToBottomBtn,
    sendIcon
}: CustomizableMessagingViewProps<CustomStyle>): ReactNode => {
    if (data === undefined || data.status != "available" || (showBottomBar && attribute === undefined) || (showBottomBar && bottomBarVisibility.status != ValueStatus.Available)) {
        return null;
    }

    const [recordCount, setRecordCount] = useState(0);
    const [runCount, setRunCount] = useState<number>(1);
    const [yScroll, setYScroll] = useState<number>(0);
    const [inputHeight, setInputHeight] = useState(40);
    const [flatlistHeight, setFlatlistHeight] = useState(0);
    const [styleProp, setStyleProp] = useState<StyleProps>({
        scrollToBottomButtonPositionY: 0,
        scrollToBottomButtonColor: colorSTB,
        bottomBarBackgroundColor: bottomBarBGC
    });

    // @ts-ignore
    const mergedStyles = mergeNativeStyles(styles(styleProp), style);
    const [value, setValue] = useState(attribute?.displayValue);
    const [isButtonPressed, SetIsButtonPressed] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    let outerContainerRef = useRef(null);
    let flatListRef = useRef(null);
    let msgTextBox = useRef(null);
    let bottomBarOuterContainerRef = useRef(null);
    let textSyncTimeout = keyPressTimeout;

    if (runCount === 1) {
        setRecordCount(pageSize);
        setRunCount(runCount + 1);
    }

    // Update style props
    useEffect(() => {
        setStyleProp({
            scrollToBottomButtonPositionY: 0,
            scrollToBottomButtonColor: colorSTB,
            bottomBarBackgroundColor: bottomBarBGC
        })
    }, [])

    // Updates text input value everytime there's a change
    useEffect(() => {
        setValue(attribute?.displayValue);
        attribute?.displayValue === '' ? setIsEnabled(false) : setIsEnabled(true);
    }, [attribute]);

    const syncValueWithAttribute = useCallback(
        (newValue: string) => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => {
                attribute?.setTextValue(newValue);
                if(onChangeAction?.canExecute && !onChangeAction.isExecuting){
                    onChangeAction.execute();
                }
                setIsEnabled(newValue.trim().length > 0);
            }, textSyncTimeout);
        },
        [attribute]
    );

    // Updates attribute value with user key press & enables send button if not empty
    const onValueChange = (newValue: any) => {
        setValue(newValue);
        syncValueWithAttribute(newValue);
    };
    // const onValueChange = useMemo(() => {
    //     return debounce((newValue: string) => {
    //         setValue(newValue);
    //         attribute?.setTextValue(newValue);
    //         setIsEnabled(newValue.trim().length > 0);
    //     }, 200);
    // }, [attribute]);

    // Triggers send action nanoflow if enabled and available
    const runOnSend = () => {
        if (isEnabled && sendButtonAction && sendButtonAction.canExecute) {
            sendButtonAction.execute();
            setInputHeight(40);
            // onContentSizeChange();
        }
    };

    // Triggers send action nanoflow if enabled and available
    const runOnMediaAction = () => {
        if (mediaButtonAction && mediaButtonAction.canExecute) {
            mediaButtonAction.execute();
            setInputHeight(40);
            // onContentSizeChange();
        }
    };

    // Function to get the data
    const getData = useCallback(
        (count: Option<number>) => {
            data.setLimit(count);
            return data.items;
        },
        [data, runCount]
    );

    // Function to trigger getting next set of data
    const onPageEndReached = useCallback(() => {
        setRecordCount(runCount * pageSize);
        setRunCount(runCount + 1);
        if (pageEndAction?.canExecute) {
            pageEndAction.execute();
        }
    },[pageEndAction, pageSize]);

    const onContentSizeChange = useCallback((event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        let h = event.nativeEvent.contentSize.height;
        setInputHeight(h > inputMaxHeight ? inputMaxHeight : h);
    }, [value])

    // Function to render the bottom bar
    const renderBottomBar = useMemo(() => {
        if (showBottomBar && bottomBarVisibility.value) {
            return (
                <View style={[mergedStyles.bottomBarOuterContainer, { height: Math.max(55, inputHeight + 15) }]} ref={bottomBarOuterContainerRef}>
                    <Pressable
                        style={mergedStyles.btnMediaContainer}
                        onPress={runOnMediaAction}
                        onPressIn={() => SetIsButtonPressed(true)}
                        onPressOut={() => SetIsButtonPressed(false)}
                    >
                        <Image source={mediaBtnIcon.value} style={{ height: 20, width: 20, resizeMode: "contain" }} />
                    </Pressable>
                    <TextInput
                        style={[mergedStyles.textInput, { height: Math.max(40, inputHeight) }]}
                        textAlignVertical="top"
                        placeholder={placeholder.value}
                        placeholderTextColor={placeholderTextColor?.value}
                        value={value}
                        multiline
                        onContentSizeChange={(event) => {
                            onContentSizeChange(event);
                        }
                        }
                        onChangeText={(value: any) => {
                            onValueChange(value);
                        }}
                        ref={msgTextBox}
                        maxLength={textMaxLength}
                    />
                    <Pressable
                        style={isEnabled ? (isButtonPressed ? mergedStyles.btnContainerPressed : mergedStyles.btnContainer) : mergedStyles.btnContainerDisabled}
                        onPress={runOnSend}
                        onPressIn={() => SetIsButtonPressed(true)}
                        onPressOut={() => SetIsButtonPressed(false)}
                    >
                        <Image source={sendIcon.value} style={{ height: 20, width: 20, resizeMode: "contain" }} />
                    </Pressable>
                </View>
            );
        } else {
            return null;
        }
    },[showBottomBar, bottomBarVisibility, inputHeight, value]);

    // Function to render the button to scroll to the latest message
    const renderScrollToBottomButton = () => {
        if (showSTB && yScroll > 0) {
            return (
                <Pressable
                    style={mergedStyles.button}
                    onPress={() => {
                        if (flatListRef.current != undefined) {
                            // @ts-ignore
                            flatListRef.current.scrollToIndex({
                                animated: true,
                                index: 0
                            });
                        }
                    }}
                >
                    <Image
                        style={mergedStyles.btnGlyph}
                        source={scrollToBottomBtn.value}
                    />
                </Pressable>
            );
        } else {
            return null;
        }
    };

    // Function to render list items
    const renderItem = useCallback(
        ({ item, index }: { item: ObjectItem; index: number }) => {
            const contentValue = content?.get(item); // Ensure safe retrieval
            return (
                <View key={item.id || index} testID={`content-${index}`} accessible>
                    {contentValue}
                </View>
            );
        },
        [content] // Add dependencies as needed
    );

    // Function to capture messages scrolling
    const onFLScroll = (r: { nativeEvent: { contentOffset: { y: any } } }) => {
        setYScroll(r.nativeEvent.contentOffset.y);
    };

    // Function to capture size of the listview
    const onLayoutFlatlist = (event: { nativeEvent: { layout: { y: any; height: any } } }) => {
        const { height, y } = event.nativeEvent.layout;
        if(flatlistHeight === 0) setFlatlistHeight(height);
        const heightCalc = y + height - 50;
        setStyleProp((prevState: any) => ({
            ...prevState,
            scrollToBottomButtonPositionY: heightCalc,
        }));
    };

    const renderMessageList = () => {
        return (
            <View ref={outerContainerRef} style={[mergedStyles.flatlistOuterContainer, { maxHeight: flatlistHeight === 0 ? windowHeight : flatlistHeight }]}>
                <FlatList
                    ref={flatListRef}
                    data={getData(recordCount)}
                    renderItem={renderItem}
                    keyExtractor={(item: { id: any; }) => item.id}
                    inverted={true}
                    onEndReachedThreshold={0}
                    onEndReached={onPageEndReached}
                    persistentScrollbar={true}
                    onScroll={onFLScroll}
                    style={mergedStyles.flatList}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onLayout={onLayoutFlatlist}
                />
            </View>
        )
    }

    return (
        <View style={mergedStyles.container}>
            {renderMessageList()}
            {renderBottomBar}
            {renderScrollToBottomButton()}
        </View>
    );
}

const styles = (styleProps: StyleProps) =>
    StyleSheet.create({
        container: {
            flex: 2,
            maxHeight: windowHeight
        },
        flatList: {
            zIndex: 1,
            flex: 1
        },
        bottomBarOuterContainer: {
            height: 55,
            // flex: 1,
            flexDirection: "row",
            padding: 10,
            zIndex: 1,
            backgroundColor: styleProps.bottomBarBackgroundColor,
            alignContent: 'space-between'
        },
        button: {
            position: "absolute",
            top: styleProps.scrollToBottomButtonPositionY,
            right: 10,
            backgroundColor: styleProps.scrollToBottomButtonColor,
            borderRadius: 20,
            width: 30,
            height: 30,
            alignItems: "center",
            zIndex: 2
        },
        btnGlyph: {
            height: 20,
            width: 20,
            marginTop: 5,
            resizeMode: "contain"
        },
        btnMediaContainer: {
            backgroundColor: "#264AE5",
            flex: 1,
            flexDirection: "column",
            padding: 10,
            justifyContent: "center",
            height: 40,
            marginLeft: 5,
            borderRadius: 8,
            alignItems: "center",
            textAlign: "center",
            position: "absolute",
            bottom: 5,
            left: 0,
            width: 40
        },
        btnMediaContainerPressed: {
            backgroundColor: "#2666e5",
            flex: 1,
            flexDirection: "column",
            padding: 10,
            justifyContent: "center",
            height: 40,
            marginLeft: 5,
            borderRadius: 8,
            alignItems: "center",
            textAlign: "center",
            position: "absolute",
            bottom: 5,
            left: 0,
            width: 40
        },
        btnContainer: {
            backgroundColor: "#264AE5",
            flex: 1,
            flexDirection: "column",
            padding: 10,
            justifyContent: "center",
            height: 40,
            marginLeft: 5,
            borderRadius: 8,
            alignItems: "center",
            textAlign: 'center',
            position: "absolute",
            bottom: 5,
            right: 0,
            width: 40
        },
        btnContainerPressed: {
            backgroundColor: "#2666e5",
            flex: 1,
            flexDirection: "column",
            padding: 10,
            justifyContent: "center",
            height: 40,
            marginLeft: 5,
            borderRadius: 8,
            alignItems: "center",
            textAlign: 'center',
            position: "absolute",
            bottom: 5,
            right: 0,
            width: 40
        },
        btnContainerDisabled: {
            backgroundColor: "#CED0D3",
            flex: 1,
            flexDirection: "column",
            padding: 10,
            justifyContent: "center",
            height: 40,
            marginLeft: 5,
            borderRadius: 8,
            alignItems: "center",
            textAlign: 'center',
            position: "absolute",
            bottom: 5,
            right: 0,
            width: 40
        },
        textInput: {
            // height: 35,
            borderColor: "#CED0D3",
            borderWidth: 0.5,
            padding: 5,
            borderRadius: 4,
            flex: 1,
            // flexDirection: "row",
            // flexDirection: "column-reverse",
            // position: "absolute",
            // bottom: 5,
            // left: 50,
            alignSelf: 'stretch',
            marginBottom: 5,
            marginLeft: 45,
            marginRight: 45,
            // width: (windowWidth - 125),
            backgroundColor: styleProps.bottomBarBackgroundColor
        },
        flatlistOuterContainer: {
            flex: 20,
            zIndex: 1
        }
    });

CustomizableMessagingView.displayName = "CustomizableMessagingView";