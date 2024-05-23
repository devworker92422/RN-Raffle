import {
    View,
    Text,
    StyleSheet
} from "react-native";

const HistoryScreen = () => {
    return (
        <View style={styles.container}>
            <Text>This is the History screen</Text>
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
});

export default HistoryScreen;