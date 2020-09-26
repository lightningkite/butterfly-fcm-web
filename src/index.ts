import {ViewGenerator} from "butterfly/dist/views/ViewGenerator";
import {main} from "butterfly/dist/main";
import firebase from "firebase";
import {Notifications} from "./Notifications";
import {tryCastInterface} from "butterfly/dist/kotlin/Language";
import {
    ForegroundNotificationHandler,
    ForegroundNotificationHandlerResult
} from "./ForegroundNotificationHandler";

export function mainWithFcm(rootVg: ViewGenerator, fcmPublicKey?: string): void {
    main(rootVg);
    Notifications.INSTANCE.handler = tryCastInterface<ForegroundNotificationHandler>(rootVg, "ForegroundNotificationHandler");
    if(fcmPublicKey){
        Notifications.INSTANCE.fcmPublicKey = fcmPublicKey;
    }
}