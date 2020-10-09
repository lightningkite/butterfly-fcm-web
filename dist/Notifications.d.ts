import { StandardObservableProperty } from "butterfly/dist/observables/StandardObservableProperty";
import * as firebase from "firebase/app";
import "firebase/messaging";
import { ForegroundNotificationHandler } from "./ForegroundNotificationHandler";
import MessagePayload = firebase.messaging.MessagePayload;
interface Payload {
    data: Record<string, string>;
    notification: PayloadNotification;
}
interface PayloadNotification extends NotificationOptions {
    title: string;
}
export declare class Notifications {
    static INSTANCE: Notifications;
    notificationToken: StandardObservableProperty<string | null>;
    handler: ForegroundNotificationHandler | null;
    fcmPublicKey?: string;
    additionalMessageListener: (payload: Payload | MessagePayload) => void;
    serviceWorkerLocation?: string;
    constructor();
    payloadReceived(payload: Payload): void;
    request(firebaseAppName?: string): void;
}
export {};
