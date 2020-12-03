"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StandardObservableProperty_1 = require("butterfly-web/dist/observables/StandardObservableProperty");
const firebase = __importStar(require("firebase/app"));
require("firebase/messaging");
const ForegroundNotificationHandler_1 = require("./ForegroundNotificationHandler");
function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    }
    catch (e) {
        return false;
    }
    return true;
}
//! Declares com.lightningkite.butterfly.fcm.Notifications
class Notifications {
    constructor() {
        this.notificationToken = new StandardObservableProperty_1.StandardObservableProperty(null);
        this.handler = null;
        this.additionalMessageListener = () => {
        };
        window.Notifications = this;
    }
    payloadReceived(payload) {
        var _a;
        this.additionalMessageListener(payload);
        let data;
        let payData = payload.data;
        if (payData) {
            data = new Map(Object.entries(payData));
        }
        else {
            data = new Map();
        }
        let handledState = (_a = this.handler) === null || _a === void 0 ? void 0 : _a.handleNotificationInForeground(data);
        if (handledState != ForegroundNotificationHandler_1.ForegroundNotificationHandlerResult.SUPPRESS_NOTIFICATION) {
            new Notification(payload.notification.title, payload.notification);
        }
    }
    request(insistMessage = null, onResult = () => { }) {
        let onBrowserResult = (x) => {
            if (x == "granted") {
                onResult(true);
                const messaging = firebase.messaging(firebase.app());
                let getToken = (serviceWorkerRegistration) => {
                    return messaging.getToken({
                        vapidKey: this.fcmPublicKey,
                        serviceWorkerRegistration: serviceWorkerRegistration
                    });
                };
                (this.serviceWorkerLocation ? navigator.serviceWorker.register(this.serviceWorkerLocation)
                    .then((x) => getToken(x)) : getToken())
                    .then((value) => {
                    Notifications.INSTANCE.notificationToken.value = value;
                })
                    .catch((err) => {
                    console.warn('Unable to retrieve refreshed token ', err);
                });
                messaging.onMessage((payload) => {
                    this.payloadReceived(payload);
                });
            }
            else {
                onResult(false);
            }
        };
        if (checkNotificationPromise()) {
            Notification.requestPermission().then(onBrowserResult);
        }
        else {
            Notification.requestPermission(onBrowserResult);
        }
    }
}
exports.Notifications = Notifications;
Notifications.INSTANCE = new Notifications();
//# sourceMappingURL=Notifications.js.map