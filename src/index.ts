import {ViewGenerator} from "butterfly-web/dist/views/ViewGenerator";
import {main} from "butterfly-web/dist/main";
import firebase from "firebase";
import {Notifications} from "./Notifications";
import {tryCastInterface} from "butterfly-web/dist/kotlin/Language";
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