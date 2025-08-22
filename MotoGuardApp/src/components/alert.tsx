import { Dialog, Toast, ALERT_TYPE } from 'react-native-alert-notification';

export function DialogNotification(type: ALERT_TYPE, title: string, textBody: string, button: string){
    Dialog.show({
        type,
        title,
        textBody,
        button,
    });
}
export function ToastNotification(type: ALERT_TYPE, title: string, textBody: string){
    Toast.show({
        type,
        title,
        textBody,
    });
}