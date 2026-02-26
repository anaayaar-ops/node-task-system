import 'dotenv/config';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    deviceId: "E6000F4B36B6E60", // الـ Android ID من صورتك
    gateA: parseInt(process.env.ENTRY_P),
    gateB: parseInt(process.env.EXIT_P),
    trigger: process.env.MATCH_V,
    action: process.env.EXEC_V,
    myId: "80055399"
};

const service = new WOLF({
    connection: { 
        platform: 1, // أندرويد
        deviceId: settings.deviceId 
    },
    presence: { onlineState: 2 }
});

// لمنع أخطاء المكتبات الصوتية في GitHub
process.on('unhandledRejection', (reason) => {
    if (reason && reason.message && reason.message.includes('wrtc')) return;
});

service.on('ready', async () => {
    console.log(`✅ تم الاتصال بنجاح!`);
    console.log(`📱 البصمة المطابقة للجوال: ${settings.deviceId}`);
    try {
        await service.messaging().sendPrivateMessage(settings.gateA, "!س تدريب كل 1");
    } catch (e) {}
});

service.on('loginFailed', (err) => {
    console.log("❌ فشل تسجيل الدخول. تأكد من صحة الإيميل والباسورد في Secrets.");
    console.error(err);
});

// تسجيل الدخول مع تحديد المنصة (1 للأندرويد)
service.login(settings.identity, settings.secret, 1);
