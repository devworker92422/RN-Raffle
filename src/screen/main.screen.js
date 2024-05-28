import { useEffect } from "react";
import {
    View,
    StyleSheet,
    Alert,
    BackHandler
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
    connectDB,
    checkDBExist,
    createUserTable,
    createSettingTable,
    createSquareTable,
    insertUserData,
    readLastSetting,
    readLastSquare,
    updateSetting,
    endDate2Str
} from "../helper";
import { dbAction } from "../store/slice/db.slice";
import { squareAction } from "../store/slice/square.slice";
import { settingAction } from "../store/slice/setting.slice";
import { DB_FILE_NAME } from "../config";

const MainScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const { dbFlag } = useSelector((state) => state.dataBase);
    const lastSetting = useSelector((state) => state.setting);

    const onPressStartBtn = async () => {
        if (lastSetting.isFinished != 0) {
            Alert.alert("Please fill the setting fields");
            return;
        }
        navigation.navigate('board');
    }

    const onPressSettingBtn = async () => {
        if (lastSetting.isFinished == 0) {
            Alert.alert('Raffle', 'Do you want to start new raffle', [
                {
                    text: 'Yes',
                    onPress: () => finishGame()
                },
                {
                    text: 'No',
                }
            ]);
            return;
        } else {
            navigation.navigate('setting');
        }
    }

    const finishGame = async () => {
        let params = {
            id: lastSetting.id,
            isFinished: 3,
        }
        const db = connectDB(DB_FILE_NAME);
        await updateSetting(params, db);
        dispatch(settingAction({ type: 'isFinished', data: 3 }));
        navigation.navigate('setting');
    }


    const onPressHistoryBtn = () => {
        navigation.navigate('history');
    }

    const onPressExitBtn = async () => {
        Alert.alert('Raffle', 'Exit Game', [
            {
                text: 'OK',
                onPress: () => BackHandler.exitApp(),
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    }

    useEffect(() => {
        const connection = connectDB(DB_FILE_NAME);
        const init = async () => {
            if (!dbFlag) {
                const dbFlag = await checkDBExist(connection);
                if (dbFlag != 1) {
                    await createUserTable(connection);
                    await createSettingTable(connection);
                    await createSquareTable(connection);
                    await insertUserData(connection);
                } else {
                    const lastSetting = await readLastSetting(connection);
                    const lastSquare = await readLastSquare(connection);
                    if (lastSetting.status && lastSetting.data) {
                        if (lastSetting.isFinished == 1) {
                            Object.keys(lastSetting.data).map((key) => {
                                dispatch(settingAction({ type: key, data: lastSetting.data[key] }));
                            });
                        }
                    }
                    if (lastSquare.status && lastSquare.data) {
                        dispatch(squareAction({ type: 'lastSquareId', data: lastSquare.data.id }));
                    }
                }
                dispatch(dbAction({ type: "dbFlag", data: true }));
            }
        }
        init();
    }, [])

    return (
        <View style={styles.container}>
            {
                lastSetting?.isFinished == 0 ? (
                    <View style={styles.settingBar}>
                        <View style={styles.settingItem}>
                            <Text variant="titleLarge" style={styles.blodText}>Price Per Square :</Text>
                            <Text variant="titleLarge" style={styles.ligthText}>$ {lastSetting?.price}</Text>
                        </View>
                        <View style={styles.settingItem}>
                            <Text variant="titleLarge" style={styles.blodText}>EndDateTime:</Text>
                            <Text variant="titleLarge" style={styles.ligthText}>{endDate2Str(lastSetting?.endDate)}</Text>
                        </View>
                        <View style={styles.settingItem}>
                            <Text variant="titleLarge" style={styles.blodText}>Solden Squares :</Text>
                            <Text variant="titleLarge" style={styles.ligthText}>{lastSetting?.squares}</Text>
                        </View>
                    </View>
                ) : null
            }
            <Button mode="outlined" onPress={onPressStartBtn} style={styles.button}>
                <Text>Start</Text>
            </Button>
            <Button mode="outlined" onPress={onPressSettingBtn} style={styles.button}>
                <Text>Setting</Text>
            </Button>
            <Button mode="outlined" onPress={onPressHistoryBtn} style={styles.button}>
                <Text>History</Text>
            </Button>
            <Button mode="outlined" onPress={onPressExitBtn} style={styles.button}>
                <Text>Exit</Text>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'right',
        justifyContent: 'center',
        padding: 25
    },
    button: {
        marginBottom: 15,
        marginTop: 15
    },
    settingBar: {
        borderStyle: 'solid',
        borderColor: 'purple',
        borderWidth: 2,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        marginTop: 15
    },
    settingItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    blodText: {
        fontWeight: 700
    },
    ligthText: {
        fontWeight: 300
    }
})

export default MainScreen;