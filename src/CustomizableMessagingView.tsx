import { createElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Image, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, TextInputContentSizeChangeEventData, TextStyle, View, ViewStyle } from "react-native";
import { mergeNativeStyles, Style } from "@mendix/pluggable-widgets-tools";
// import { HelloWorld } from "./components/HelloWorld";
import { CustomizableMessagingViewProps } from "../typings/CustomizableMessagingViewProps";
import { ObjectItem, Option, ValueStatus } from "mendix";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export interface StyleProps {
    scrollToBottomButtonPositionY: number;
    scrollToBottomButtonColor: string;
    bottomBarBackgroundColor: string;
}

const sendIcon = {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPUSURBVHgB7ZuLbdswEIbPRQdwN1A3yAjaoN4g2qDZINmg7gRKJig6Ad0JjE7AbpBu8JcEGVRJ7BMfR4ay8gGMA4gv/7g7Hs820TsEYGvajWkKDm3aLa0ZL8owEeUUN7QmvCi9aT9Me8Q8j7QGvCjfAkV5xoYuFCuKefli2mDaltI4fKQLwohyRf9F6Sifh8VbkI0r5uWrab1vknxepAV5UQZy1tJTGQ6bzebPYgTyouxMu6Zyokx5sH+adjEvio0rTy6UGmxT+GQs6G+TFiR0AuVwb8Wx/zQjUAFRDqb9Jmd9sfykFrDHsr3zwN19JFBwd6qtnzs6MbR7me6xugVB/lg+mPbLtP2TW8DlQ4rSLPFAtcHr23Iu2rQ7OLd8uVaq5TzRUw0QdluOwb7pPfcGECYO91xTSRB/W84WJUGcPfN8pBIg47Z85k0oP2dQDEG4OFfgLbonKSArCvzGrUtGBVbEidMxffLdCwWPZUoAEeL4/gPTb08pwMWVW8gFWwV3AmUlg4gUx49RTN8uZvFqx3JFcTj3OoYsWv1YriWOH3fD9B/mFr1F5WO5pjh+7JEZ09GMOLmiKEQcy28gDudeam5hjTQUEo7lFHLE8eO55HCYWzyWYw1RJvvLEsfPoZmx3dwGFOLRmFNeACFxemasCtlEh3Q306aNiMkhApEQx88zMuMHCgUunmikM0oJJSWOn0szc8SHCuTnQgoZ7icsDudeeTd3ONe7Rzo6VihJcfx8IzPPjiSYCKWRLpS99XdUURw/57n5yhTGUChOFRJnx+2DSgKZOLXzc4mL4+cdmfl6qgFk4lQJcbbcmlQb5McpMXH8frjCWFn3CtycRj5J4vg9KGbenloAeXEqR5yydWdpEB+nksXx68nXnWuA8Dh1pAwgVXd+SzAfp3pKALl155YAXyNWlABy6s6tAZerPEpaEVLrzq0C91HQOaLyFeTUnVsFfMZrrSu4XoOcunPLgE8B7iLm0cw8HS0V8EWtICtCbt25dZD5kyRI1Z1bZcYCZq8HkK47twgSE0eUrDsbPlA7fGeecT+PvGaetfF9ZwmQmDiicN25GQvy33HmrOiVpcCVbc/FmANdGuATR8v2Rf8RkRa3eBCYOKK1unMtEJg4ouW6c2kQkDhiCXXnUsxYkcbS6s4lAJ84jsyzduvOkoCvDnJ0tAYwnzieQrzu3NJV4xkBieMpYvsvG8wnjut0rykI/9CxSGGsWRebcB/Y74HWCsI+4+9orYBPHIu516IAnzgOtHbAJ46XUXfOAe7I1yfEWcfVIgS4S6rywtgs+44K8w9/T9oonu4qLQAAAABJRU5ErkJggg=="
};

const scrollToBottomBtn = {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAUCAYAAAB1aeb6AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADSSURBVHgBzZVtDYMwEIZPwiQgAQlIwAE42ByAg80BczAJkzAJlVAJt2u2ZaUpXD/uEt7kEkLb93n6qwBHCSJ2NDNNAwqh3jPNEFto8R8jLUB9i9c/hWCL64gJBOC1AH08MR5TK+AgG93IwV1eNCcoyB7YXey3qfneUkyAAbv0/mYxgQTwGDvECSwq4EDAlggkgGdIsG9zBejfUA3OELiqgL3SjimdaHpxsCcwMuVWBZwhEMsNpEJllwzwHaSDn+eWywO0wggUvwO1AvrgDQFTAn4DhXPkVYBoonUAAAAASUVORK5CYII="
}

const mediaBtnIcon = {
    uri: "data:image/png;base64,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"
};

const windowWidth = Dimensions.get('window').width;
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
    textMaxLength = 750
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
                        <Image source={mediaBtnIcon} style={{ height: 20, width: 20, resizeMode: "contain" }} />
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
                        <Image source={sendIcon} style={{ height: 20, width: 20, resizeMode: "contain" }} />
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
                        source={scrollToBottomBtn}
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
            position: "absolute",
            bottom: 5,
            left: 50,
            width: (windowWidth - 125),
            backgroundColor: styleProps.bottomBarBackgroundColor
        },
        flatlistOuterContainer: {
            flex: 20,
            zIndex: 1
        }
    });

CustomizableMessagingView.displayName = "CustomizableMessagingView";