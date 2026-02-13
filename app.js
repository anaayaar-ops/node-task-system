import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

// إعدادات البوت من ملف البيئة
const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateA: parseInt(process.env.ENTRY_P), // معرف مصدر الطاقة (يرسل له الخاص)
    gateB: parseInt(process.env.EXIT_P),  // رقم الروم (للمراقبة والإرسال)
    trigger: process.env.MATCH_V,         // الكلمة المفتاحية للطاقة
    action: process.env.EXEC_V,          // الرسالة التي سيجلد بها البوت
    myId: "51660277"                      // معرفك الخاص للمطابقة
};

const service = new WOLF();

// --- دالة الإرسال الموحدة ---
const executeAction = async () => {
    try {
        console.log("🎯 محاولة تنفيذ الإرسال...");
        await service.messaging.sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم الإرسال بنجاح إلى الروم [${settings.gateB}]`);
    } catch (err) {
        console.error("❌ فشل الإرسال:", err.message);
    }
};

// --- حدث التشغيل (Ready) ---
service.on('ready', async () => {
    console.log("------------------------------------------");
    console.log(`✅ البوت متصل الآن باسم: ${service.currentSubscriber.nickname}`);
    console.log(`📍 الروم المستهدف: ${settings.gateB}`);
    console.log("------------------------------------------");

    // إرسال رسالة التدريب فور تشغيل البوت
    try {
        console.log(`✉️ إرسال أمر البدء إلى الخاص [${settings.gateA}]...`);
        await service.messaging.sendPrivateMessage(settings.gateA, "!س تدريب كل 1");
        console.log("✅ تم إرسال '!س تدريب كل 1' بنجاح.");
    } catch (err) {
        console.error("❌ فشل إرسال أمر التشغيل الأول:", err.message);
    }
});

// --- معالجة الرسائل (صادر ووارد) ---
service.on('message', async (message) => {
    const text = message.content?.trim();
    if (!text) return;

    // 1. مراقبة رسالة الطاقة في الخاص (من gateA)
    if (message.isPrivate && message.authorId === settings.gateA) {
        if (text.includes(settings.trigger)) {
            console.log("⚡ رصد إشارة طاقة! جاري الجلد...");
            await executeAction();
        }
    }

    // 2. مراقبة "السباق جاري" في الروم (gateB)
    if (message.isGroup && message.targetGroupId === settings.gateB) {
        if (text.includes("ما زال السباق جاريًا") && text.includes(settings.myId)) {
            
            // استخراج عدد الثواني من الرسالة
            const match = text.match(/\d+/);
            const waitSeconds = match ? parseInt(match[0]) : 20;
            
            console.log(`⚠️ السباق جارٍ. انتظار ${waitSeconds} ثانية ثم إعادة المحاولة...`);

            // الانتظار ثم إعادة المحاولة تلقائياً
            setTimeout(async () => {
                console.log("🔄 انتهى الانتظار. إعادة المحاولة الآن...");
                await executeAction();
            }, (waitSeconds + 1) * 1000); // إضافة ثانية واحدة للأمان
        }
    }
});

// التعامل مع أخطاء الاتصال
service.on('error', (err) => {
    console.error("⚠️ خطأ في الاتصال بالخادم:", err.message);
});

// تسجيل الدخول
service.login(settings.identity, settings.secret);
