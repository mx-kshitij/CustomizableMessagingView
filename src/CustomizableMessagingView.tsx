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

/* const sendIcon = {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPUSURBVHgB7ZuLbdswEIbPRQdwN1A3yAjaoN4g2qDZINmg7gRKJig6Ad0JjE7AbpBu8JcEGVRJ7BMfR4ay8gGMA4gv/7g7Hs820TsEYGvajWkKDm3aLa0ZL8owEeUUN7QmvCi9aT9Me8Q8j7QGvCjfAkV5xoYuFCuKefli2mDaltI4fKQLwohyRf9F6Sifh8VbkI0r5uWrab1vknxepAV5UQZy1tJTGQ6bzebPYgTyouxMu6Zyokx5sH+adjEvio0rTy6UGmxT+GQs6G+TFiR0AuVwb8Wx/zQjUAFRDqb9Jmd9sfykFrDHsr3zwN19JFBwd6qtnzs6MbR7me6xugVB/lg+mPbLtP2TW8DlQ4rSLPFAtcHr23Iu2rQ7OLd8uVaq5TzRUw0QdluOwb7pPfcGECYO91xTSRB/W84WJUGcPfN8pBIg47Z85k0oP2dQDEG4OFfgLbonKSArCvzGrUtGBVbEidMxffLdCwWPZUoAEeL4/gPTb08pwMWVW8gFWwV3AmUlg4gUx49RTN8uZvFqx3JFcTj3OoYsWv1YriWOH3fD9B/mFr1F5WO5pjh+7JEZ09GMOLmiKEQcy28gDudeam5hjTQUEo7lFHLE8eO55HCYWzyWYw1RJvvLEsfPoZmx3dwGFOLRmFNeACFxemasCtlEh3Q306aNiMkhApEQx88zMuMHCgUunmikM0oJJSWOn0szc8SHCuTnQgoZ7icsDudeeTd3ONe7Rzo6VihJcfx8IzPPjiSYCKWRLpS99XdUURw/57n5yhTGUChOFRJnx+2DSgKZOLXzc4mL4+cdmfl6qgFk4lQJcbbcmlQb5McpMXH8frjCWFn3CtycRj5J4vg9KGbenloAeXEqR5yydWdpEB+nksXx68nXnWuA8Dh1pAwgVXd+SzAfp3pKALl155YAXyNWlABy6s6tAZerPEpaEVLrzq0C91HQOaLyFeTUnVsFfMZrrSu4XoOcunPLgE8B7iLm0cw8HS0V8EWtICtCbt25dZD5kyRI1Z1bZcYCZq8HkK47twgSE0eUrDsbPlA7fGeecT+PvGaetfF9ZwmQmDiicN25GQvy33HmrOiVpcCVbc/FmANdGuATR8v2Rf8RkRa3eBCYOKK1unMtEJg4ouW6c2kQkDhiCXXnUsxYkcbS6s4lAJ84jsyzduvOkoCvDnJ0tAYwnzieQrzu3NJV4xkBieMpYvsvG8wnjut0rykI/9CxSGGsWRebcB/Y74HWCsI+4+9orYBPHIu516IAnzgOtHbAJ46XUXfOAe7I1yfEWcfVIgS4S6rywtgs+44K8w9/T9oonu4qLQAAAABJRU5ErkJggg=="
}; */

/* const scrollToBottomBtn = {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAUCAYAAAB1aeb6AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADSSURBVHgBzZVtDYMwEIZPwiQgAQlIwAE42ByAg80BczAJkzAJlVAJt2u2ZaUpXD/uEt7kEkLb93n6qwBHCSJ2NDNNAwqh3jPNEFto8R8jLUB9i9c/hWCL64gJBOC1AH08MR5TK+AgG93IwV1eNCcoyB7YXey3qfneUkyAAbv0/mYxgQTwGDvECSwq4EDAlggkgGdIsG9zBejfUA3OELiqgL3SjimdaHpxsCcwMuVWBZwhEMsNpEJllwzwHaSDn+eWywO0wggUvwO1AvrgDQFTAn4DhXPkVYBoonUAAAAASUVORK5CYII="
} */

/* const mediaBtnIcon = {
    uri: "data:image/png;base64,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"
}; */

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