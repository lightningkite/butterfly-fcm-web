"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWithFcm = void 0;
const main_1 = require("butterfly-web/dist/main");
const Notifications_1 = require("./Notifications");
const Language_1 = require("butterfly-web/dist/kotlin/Language");
function mainWithFcm(rootVg, fcmPublicKey) {
    main_1.main(rootVg);
    Notifications_1.Notifications.INSTANCE.handler = Language_1.tryCastInterface(rootVg, "ForegroundNotificationHandler");
    if (fcmPublicKey) {
        Notifications_1.Notifications.INSTANCE.fcmPublicKey = fcmPublicKey;
    }
}
exports.mainWithFcm = mainWithFcm;
//# sourceMappingURL=index.js.map