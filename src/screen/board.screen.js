import { useState, useEffect, useRef } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
    Text,
    Modal,
    Button,
    PaperProvider,
    Portal,
    TextInput
} from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import moment from "moment";

import {
    connectDB,
    insertSquare,
    readSquareOfSetting,
    updateSetting,
    updateWinnerOfSetting,
    dateTime2Str,
    endDate2Str,
} from "../helper";
import { settingAction } from "../store/slice/setting.slice";
import { DB_FILE_NAME } from "../config";

const BoardScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const setting = useSelector((state) => state.setting);
    const [winnerModal, setWinnerModal] = useState(false);
    const [contentModal, setContentModal] = useState(false);
    const [current, setCurrent] = useState(new Date());
    const [squareId, setSquareID] = useState(setting.squares + 1);
    const [squareCount, setSquareCount] = useState(setting.squares);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");
    const [winner, setWinner] = useState({});
    const [error, setError] = useState(false);

    const phoneInput = useRef(null);

    const onPressSquare = async () => {
        setContentModal(true);
    }

    const onPressOkOfWinner = () => {
        dispatch(settingAction({ type: 'isFinished', data: 1 }));
        setWinnerModal(false);
        navigation.navigate('main');
    }

    const onPressOkOfContent = async () => {
        if (name.length < 1 || phone.length < 1)
            return;
        let params = {
            name,
            phoneNumber: formattedPhone,
            settingId: setting.id
        }
        const db = connectDB(DB_FILE_NAME);
        await insertSquare(params, db);
        setSquareID(squareId + 1);
        setSquareCount(squareCount + 1);
        dispatch(settingAction({ type: 'squares', data: (squareCount + 1) }));
        setName("");
        setPhone("");
        setFormattedPhone("");
        setContentModal(false);
    }

    const calcWinnerPrize = () => {
        return setting.price * squareCount * (100 - setting.profit) / 100
    }

    const finishSetting = async () => {
        const db = connectDB(DB_FILE_NAME);
        setContentModal(false);
        let squareParams = {
            settingId: setting.id
        }
        let result = await readSquareOfSetting(squareParams, db);
        let settingParam = {
            id: setting.id,
            isFinished: 1
        }
        if (result.length == 0) {
            settingParam.isFinished = 3;
            setError(true);
        } else {
            let winnerId = Math.floor((Math.random() * result.length));
            setWinner({
                id: winnerId + 1,
                name: result[winnerId].name,
                phoneNumber: result[winnerId].phoneNumber
            });
            let winnerParam = {
                id: setting.id,
                name: result[winnerId].name,
                phone: result[winnerId].phoneNumber
            }
            await updateWinnerOfSetting(winnerParam, db);
        }
        await updateSetting(settingParam, db);
        setWinnerModal(true);
    }

    useEffect(() => {
        setInterval(() => {
            setCurrent(new Date());
        }, 1000);
        let timer = setInterval(() => {
            if (moment(setting.endDate).diff(new Date(), 'seconds') < 1) {
                finishSetting();
                clearInterval(timer);
            }
        }, 3000)
    }, [])

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Portal>
                    <Modal
                        onDismiss={() => { setWinnerModal(false) }}
                        contentContainerStyle={styles.modal}
                        visible={winnerModal}
                    >
                        <View >
                            {
                                error ? (
                                    <Text variant='displaySmall' style={styles.errorTxt}>No Square is sold</Text>
                                ) : (
                                    <View>
                                        <Text variant='displaySmall' style={styles.boldTxt}>Result</Text>
                                        <View style={styles.winnerContent} >
                                            <Text style={styles.winnerTxt} >{winner.id}</Text>
                                        </View>
                                        <View style={styles.winnerInfo}>
                                            <Text variant="headlineMedium" style={styles.boldTxt}>{winner.name}</Text>
                                            <Text variant="headlineMedium" style={styles.boldTxt}>{winner.phoneNumber}</Text>
                                            <Text variant="headlineMedium" style={styles.boldTxt}>$ {calcWinnerPrize()}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            <Button mode="contained" onPress={onPressOkOfWinner} style={styles.btnText}>Ok</Button>
                        </View>
                    </Modal>
                    <Modal
                        onDismiss={() => setContentModal(false)}
                        contentContainerStyle={styles.modal}
                        visible={contentModal}
                    >
                        <View>
                            <Text variant="titleLarge">Please fill the name and phone number</Text>
                            <TextInput
                                style={styles.textInput}
                                mode="outlined"
                                label="Name"
                                value={name}
                                onChangeText={text => { setName(text) }}
                            />
                            <PhoneInput
                                ref={phoneInput}
                                defaultValue={phone}
                                defaultCode="US"
                                layout="first"
                                onChangeText={(text) => {
                                    setPhone(text);
                                }}
                                onChangeFormattedText={(text) => {
                                    setFormattedPhone(text);
                                }}
                                withDarkTheme
                                withShadow
                                autoFocus
                            />
                            <Button mode="contained" onPress={onPressOkOfContent}>
                                <Text style={styles.btnText}>Save</Text>
                            </Button>
                        </View>
                    </Modal>
                </Portal>
                <View style={styles.boxContainer}>
                    <TouchableOpacity onPress={onPressSquare}>
                        <View style={styles.box}>
                            <Text style={styles.squareText} >$ {setting.price}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.variableBar}>
                    <View style={styles.variable}>
                        <Text variant="titleLarge" style={styles.boldTxt} >Current Time : </Text>
                        <Text variant="titleLarge" style={styles.lightTxt}>{dateTime2Str(current)}</Text>
                    </View>
                    <View style={styles.variable}>
                        <Text variant="titleLarge" style={styles.boldTxt}>End Time : </Text>
                        <Text variant="titleLarge" style={styles.lightTxt}>{endDate2Str(setting.endDate)}</Text>
                    </View>
                    <View style={styles.variable}>
                        <Text variant="titleLarge" style={styles.boldTxt} >Price Per Square : </Text>
                        <Text variant="titleLarge" style={styles.lightTxt}>$ {setting.price}</Text>
                    </View>
                    <View style={styles.variable}>
                        <Text variant="titleLarge" style={styles.boldTxt}>Sold Squares : </Text>
                        <Text variant="titleLarge" style={styles.lightTxt}>{squareCount}</Text>
                    </View>
                    <View style={styles.variable}>
                        <Text variant="titleLarge" style={styles.boldTxt}>Prize : </Text>
                        <Text variant="titleLarge" style={styles.lightTxt}>$ {calcWinnerPrize()}</Text>
                    </View>
                </View>
            </View>
        </PaperProvider >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#338000',
        alignItems: 'right',
        justifyContent: 'center',
        padding: 25
    },
    variableBar: {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'purple',
        borderRadius: 15,
        padding: 15,
        marginTop: 15,
        marginBottom: 15
    },
    boldTxt: {
        fontWeight: 700
    },
    lightTxt: {
        fontWeight: 300
    },
    variable: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    boxContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
        marginTop: 25
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 200,
        width: 200,
        borderWidth: 2,
        borderColor: 'purple',
        borderRadius: 15,
        padding: 25,
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    squareText: {
        fontSize: 100,
        textShadowColor: 'white',
        textShadowOffset: {
            width: 5, height: 3
        },
        textShadowRadius: 10
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
        zIndex: 1,
    },
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    winnerContent: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15,
    },
    winnerTxt: {
        fontSize: 150,
        color: 'red',
        textShadowColor: 'black',
        textShadowOffset: {
            width: 3, height: 3
        },
        textShadowRadius: 10
    },
    winnerInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15
    },
    textInput: {
        marginTop: 15,
        marginBottom: 15
    },
    btnText: {
        marginBottom: 15,
        marginTop: 15,
        color: 'white'
    },
    errorTxt: {
        fontWeight: 700,
        color: 'red'
    }

})

export default BoardScreen; 