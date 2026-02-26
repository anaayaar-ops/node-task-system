import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    // تم إضافة البصمة المستخرجة من صورتك هنا
    deviceId: "E6000F4B36B6E60", 
    gateA: parseInt(process.env.ENTRY_P), // معرف البوت مصدر الطاقة
    gateB: parseInt(process.env.EXIT_P),  // رقم الروم
    trigger: process.env.MATCH_V,         
    action: process.env.EXEC_V,
    myId: "80055399"                      // معرفك الخاص للمطابقة
};

const service = new WOLF({
    connection: { 
        platform: 1, // تحديد المنصة كـ أندرويد (تطابق تام)
        deviceId: settings.deviceId // إجبار السيرفر على استخدام بصمة جوالك
    },
    presence: {
        onlineState: 2 // الدخول بحالة "مشغول" 
    }
});

// لمنع توقف البوت في السيرفر بسبب مكتبات الصوت المفقودة
process.on('unhandledRejection', (reason) => {
    if (reason && reason.message && reason.message.includes('wrtc')) return;
});

const executeAction = async () => {
    try {
        console.log("🎯 محاولة تنفيذ الإرسال...");
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم الإرسال بنجاح إلى [${settings.gateB}]`);
    } catch (err) {
        console.error("❌ فشل الإرسال:", err.message);
    }
};

service.on('ready', async () => {
    console.log("------------------------------------------");
    console.log(`✅ تم تسجيل الدخول بجلسة مطابقة للجوال`);
    console.log(`👤 الحساب: ${service.currentSubscriber.nickname}`);
    console.log(`📱 البصمة: ${settings.deviceId}`);
    console.log("------------------------------------------");

    try {
        await service.messaging().sendPrivateMessage(settings.gateA, "!س تدريب كل 1");
        console.log("✉️ تم إرسال أمر التدريب التلقائي بنجاح.");
    } catch (err) {
        console.error("❌ فشل إرسال أمر التدريب:", err.message);
    }
});

service.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    const text = message.content || message.body || "";

    if (senderId === settings.gateA && text.includes(settings.trigger)) {
        console.log("⚡ رصد رسالة طاقة! جاري الجلد...");
        await executeAction();
    }
});

service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    if (message.targetGroupId === settings.gateB && 
        text.includes("ما زال السباق جاريًا") && 
        text.includes(settings.myId)) {
        
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 25;
        
        console.log(`⚠️ السباق جارٍ لـ [${settings.myId}]. انتظار ${waitSeconds} ثانية...`);

        setTimeout(async () => {
            console.log("🔄 إعادة محاولة الجلد الآن...");
            await executeAction();
        }, (waitSeconds + 1) * 1000);
    }
});

// تسجيل الدخول مع تحديد نوع المنصة (أندرويد)
service.login(settings.identity, settings.secret, 1);
