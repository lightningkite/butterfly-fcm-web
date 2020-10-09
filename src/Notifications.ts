import {StandardObservableProperty} from "butterfly/dist/observables/StandardObservableProperty";
import {ViewGenerator} from "butterfly/dist/views/ViewGenerator";
import * as firebase from "firebase/app";
import "firebase/messaging"
import {tryCastInterface} from "butterfly/dist/kotlin/Language";
import {
    ForegroundNotificationHandler,
    ForegroundNotificationHandlerResult
} from "./ForegroundNotificationHandler";
import MessagePayload = firebase.messaging.MessagePayload;


interface Payload {
    data: Record<string, string>
    notification: PayloadNotification
}

interface PayloadNotification extends NotificationOptions {
    title: string
}

function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
}

//! Declares com.lightningkite.butterfly.fcm.Notifications
export class Notifications {
    static INSTANCE = new Notifications();
    notificationToken = new StandardObservableProperty<string | null>(null);
    handler: ForegroundNotificationHandler | null = null
    fcmPublicKey?: string
    additionalMessageListener: (payload: Payload | MessagePayload) => void = () => {
    }
    serviceWorkerLocation?: string

    constructor() {
        (window as any).Notifications = this
    }

    payloadReceived(payload: Payload){
        this.additionalMessageListener(payload);
        let data: Map<string, string>;
        let payData = payload.data;
        if (payData) {
            data = new Map(Object.entries(payData))
        } else {
            data = new Map();
        }

        let handledState = this.handler?.handleNotificationInForeground(data);
        if (handledState != ForegroundNotificationHandlerResult.SUPPRESS_NOTIFICATION) {
            new Notification(payload.notification.title, payload.notification)
        }
    }
    request(firebaseAppName?: string) {
        let onResult = (x: NotificationPermission) => {
            if (x == "granted") {
                const messaging = firebase.messaging(firebase.app());

                let getToken = (serviceWorkerRegistration?: ServiceWorkerRegistration) => {
                    return messaging.getToken({
                        vapidKey: this.fcmPublicKey,
                        serviceWorkerRegistration: serviceWorkerRegistration
                    })
                }

                (this.serviceWorkerLocation ? navigator.serviceWorker.register(this.serviceWorkerLocation)
                    .then((x) => getToken(x)) : getToken())
                    .then((value) => {
                        Notifications.INSTANCE.notificationToken.value = value;
                    })
                    .catch((err) => {
                        console.warn('Unable to retrieve refreshed token ', err);
                    });
                messaging.onMessage((payload: Payload) => {
                    this.payloadReceived(payload)
                });
            }
        }
        if (checkNotificationPromise()) {
            Notification.requestPermission().then(onResult);
        } else {
            Notification.requestPermission(onResult);
        }
    }
}