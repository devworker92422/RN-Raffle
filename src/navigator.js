import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import MainScreen from './screen/main.screen';
import SettingScreen from "./screen/setting.screen";
import BoardScreen from "./screen/board.screen";
import HistoryScreen from "./screen/history.screen";

const Stack = createNativeStackNavigator();

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="main" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="main" component={MainScreen} />
                <Stack.Screen name="setting" component={SettingScreen} />
                <Stack.Screen name="board" component={BoardScreen} />
                <Stack.Screen name="history" component={HistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;
