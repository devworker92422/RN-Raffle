import { useState } from "react";
import {
    View,
    StyleSheet,
    Alert,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import { useDispatch } from "react-redux";
import moment from "moment";
import { settingAction } from "../store/slice/setting.slice";
import {
    connectDB,
    insertSetting,
    dateTime2Str,
    endDate2Str,
} from "../helper";
import { DB_FILE_NAME } from "../config";

const SettingScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const [price, setPrice] = useState("");
    const [profit, setProfit] = useState("");
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const onChangePrice = (value) => {
        setPrice(parseInt(value).toString());
    }

    const onChangeProfit = (value) => {
        setProfit(parseInt(value).toString());
    }

    const onPressCalendarIcon = () => {
        setOpen(true);
    }

    const onPressConfirmOfDatePicker = (date) => {
        setDate(date);
        setOpen(false);
    }

    const onPressSaveBtn = async () => {
        let priceOfNum = parseInt(price);
        let profitOfNum = parseInt(profit);
        if (!priceOfNum || priceOfNum < 0) {
            Alert.alert("Invalid price field");
            return;
        }
        if (!profitOfNum || profitOfNum > 90 || profitOfNum < 1) {
            Alert.alert("Invalid profit field");
            return;
        }
        const timeDiff = moment(date).diff(new Date(), 'minutes');
        if (timeDiff < 2) {
            Alert.alert("Please set time as after 2 minutes");
            return;
        }
        let params = {
            price: priceOfNum,
            profit: profitOfNum,
            endDate: dateTime2Str(date),
            createAt: dateTime2Str(new Date()),
            isFinished: 0
        }
        const db = connectDB(DB_FILE_NAME);
        params['id'] = await insertSetting(db, params);
        Object.keys(params).map((a) => {
            dispatch(settingAction({ type: a, data: params[a] }));
        });
        dispatch(settingAction({ type: "squares", data: 0 }));
        navigation.navigate('main');
    }

    const onPressCancelBtn = async () => {
        navigation.navigate('main');
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                mode="outlined"
                label="Price"
                value={price}
                keyboardType="numeric"
                onChangeText={text => onChangePrice(text)}
            />
            <TextInput
                style={styles.textInput}
                mode="outlined"
                label="Profit"
                value={profit}
                keyboardType="numeric"
                onChangeText={text => onChangeProfit(text)}
            />
            <TextInput
                style={styles.textInput}
                mode="outlined"
                label="EndDate"
                value={endDate2Str(date)}
                editable={false}
                right={<TextInput.Icon icon="calendar" onPress={onPressCalendarIcon} />}
            />
            <DatePicker
                modal
                open={open}
                date={date}
                mode="datetime"
                onConfirm={(date) => {
                    onPressConfirmOfDatePicker(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <View style={styles.buttonGroup}>
                <Button mode="contained" style={styles.button} onPress={onPressSaveBtn}>
                    <Text variant="bodyMedium" style={styles.saveText}>Save</Text>
                </Button>
                <Button mode="outlined" style={styles.button} onPress={onPressCancelBtn}>
                    <Text variant="bodyMedium" style={styles.cancelText}>Cancel</Text>
                </Button>
            </View>
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
    textInput: {
        marginTop: 15,
        marginBottom: 15
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 10
    },
    saveText: {
        color: 'white'
    },
    cancelText: {
        color: 'purple'
    }
})

export default SettingScreen;
