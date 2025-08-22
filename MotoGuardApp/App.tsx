import { AlertNotificationRoot } from "react-native-alert-notification";
import { AuthProvider } from "./src/contexts/auth-context";
import Routes from "./src/routes/routes";

export default function App(){
    return (
        <AlertNotificationRoot>
            <AuthProvider>
                <Routes/>
            </AuthProvider>
        </AlertNotificationRoot>
    )
}