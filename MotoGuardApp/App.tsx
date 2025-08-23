import { AlertNotificationRoot } from "react-native-alert-notification";
import { AuthProvider } from "./src/contexts/auth-context";
import Routes from "./src/routes/routes";
import { StatusBar } from "expo-status-bar";

export default function App(){
    return (
        <AlertNotificationRoot>
            <AuthProvider>
                <Routes/>
                <StatusBar style="light" />
            </AuthProvider>
        </AlertNotificationRoot>
    )
}