import { useEffect, useState } from "react";
import {
    View,
    StyleSheet
} from "react-native";
import {
    Provider,
    Text,
    Button,
    DataTable
} from "react-native-paper";
import {
    connectDB,
    readAllSetting,
    removeAllSetting,
    removeSquare,
} from "../helper";
import { DB_FILE_NAME } from "../config";
import { TABLE_ITEMS_PER_PAGE } from "../constant";


const HistoryScreen = ({ navigation }) => {

    const [page, setPage] = useState(0);
    const [items, setItems] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(TABLE_ITEMS_PER_PAGE[0]);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    const onPressBack = () => {
        navigation.navigate('main');
    }

    const getProfit = (rate, squares, price) => {
        return squares * price * rate / 100;
    }

    const getPrize = (rate, squares, price) => {
        return squares * price * (100 - rate) / 100;
    }

    const getStatus = (value) => {
        switch (value) {
            case 0:
                return "Progress";
            case 1:
                return "Completed";
            case 2:
                return "";
            case 3:
                return "Aborted";
            default:
                return "";
        }
    }

    const init = async () => {
        const db = connectDB(DB_FILE_NAME);
        const result = await readAllSetting(db);
        setItems([...result]);
    }

    const clearHistory = async () => {
        const db = connectDB(DB_FILE_NAME);
        await removeAllSetting(db);
        await removeSquare(db);
        setItems([]);
    }

    useEffect(() => {
        init();
    }, [])

    return (
        <Provider>
            <View style={styles.container}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">Price</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">Sold Square</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">Profit</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">Winner Name</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">Phone </Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">Winner Prize</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">Status</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.headerTxt}>
                            <Text variant="bodyMedium">CreateAt</Text>
                        </DataTable.Title>
                    </DataTable.Header>
                    {
                        items.map((item) => (
                            <DataTable.Row key={item.id}>
                                <DataTable.Cell>
                                    <Text variant="labelLarge"> $ {item.price}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text variant="labelLarge">{item.squares} </Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text variant="labelLarge">$ {getProfit(item.profit, item.squares, item.price)}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text variant="labelLarge">$ {getPrize(item.profit, item.squares, item.price)}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text variant="labelLarge">{item.name}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text variant="labelLarge">{item.phone}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text variant="labelLarge"> {getStatus(item.isFinished)}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text variant="labelLarge"> {item.createAt}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))
                    }
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(items.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${items.length}`}
                        numberOfItemsPerPageList={TABLE_ITEMS_PER_PAGE}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
                <View style={styles.footer}>
                    <Button style={styles.button} mode="contained" onPress={clearHistory}>
                        Clear
                    </Button>
                    <Button style={styles.button} mode="outlined" onPress={onPressBack}>
                        Back
                    </Button>

                </View>
            </View >
        </Provider>

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
    headerTxt: {
        fontWeight: 700
    },
    footer: {
        marginTop: 15,
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        marginLeft: 10,
        marginRight: 10
    }
});

export default HistoryScreen;