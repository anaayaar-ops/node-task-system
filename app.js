import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;
const service = new WOLF();

service.on('ready', () => {
    console.log("==========================================");
    console.log("🔎 بدء الفحص العميق للمكتبة (Deep Inspection)");
    console.log("==========================================");

    // 1. فحص كائن المراسلة (المسؤول عن الإرسال)
    if (service.messaging) {
        const messagingProto = Object.getPrototypeOf(typeof service.messaging === 'function' ? service.messaging() : service.messaging);
        console.log("📩 Messaging Functions:", Object.getOwnPropertyNames(messagingProto).filter(p => typeof messagingProto[p] === 'function'));
    }

    // 2. فحص كائن البروتوكول (المسؤول عن استلام الرسائل)
    console.log("📡 Websocket Events:", Object.keys(service._events));

    // 3. فحص كائن الملف الشخصي (المسؤول عن الحالة)
    if (service.currentSubscriber) {
        console.log("👤 CurrentSubscriber Properties:", Object.keys(service.currentSubscriber));
        const subProto = Object.getPrototypeOf(service.currentSubscriber);
        console.log("👤 CurrentSubscriber Methods:", Object.getOwnPropertyNames(subProto).filter(p => typeof subProto[p] === 'function'));
    }

    // 4. فحص كائن الـ Utility (الوظائف المساعدة)
    if (service.utility) {
        const utilProto = Object.getPrototypeOf(service.utility);
        console.log("🛠️ Utility Functions:", Object.getOwnPropertyNames(utilProto).filter(p => typeof utilProto[p] === 'function'));
    }

    console.log("==========================================");
    console.log("✅ انتهى الفحص. يرجى نسخ المخرجات أعلاه.");
    console.log("==========================================");
});

service.login(process.env.U_MAIL, process.env.U_PASS);
