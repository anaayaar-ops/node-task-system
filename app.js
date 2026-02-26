import 'dotenv/config';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    deviceId: "E6000F4B36B6E60", // بصمة جهازك من الصورة
    gateA: parseInt(process.env.ENTRY_P),
    gateB: parseInt(process.env.EXIT_P),
    trigger: process.env.MATCH_V,
    action: process.env.EXEC_V,
    myId: "80055399"
};

const service = new WOLF({
    connection: { 
        platform: 1, // إجبار المنصة لتكون أندرويد
        deviceId: settings.deviceId 
    },
    presence: { onlineState: 2 }
});

// تجاهل أخطاء المكتبات المفقودة في سيرفر GitHub
process.on('unhandledRejection', (reason) => {
    if (reason && reason.message && reason.message.includes('wrtc')) return;
});

service.on('ready', async () => {
    console.log(`✅ متصل ببصمة الجوال: ${settings.deviceId}`);
    try {
        await service.messaging().sendPrivateMessage(settings.gateA, "!س تدريب كل 1");
    } catch (e) {}
});

// أضف هذا السطر للتأكد من المحاولة
service.on('loginFailed', (err) => {
    console.log("❌ فشل تسجيل الدخول. تأكد من Secrets في GitHub:", err);
});

service.login(settings.identity, settings.secret, 1);
