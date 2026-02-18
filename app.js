import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateB: parseInt(process.env.EXIT_P),  // رقم الروم (المجموعة)
    action: "الان",                       // الكلمة المطلوب إرسالها
};

const service = new WOLF();

// دالة تنفيذ الإرسال
const executeAction = async () => {
    try {
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم إرسال [${settings.action}] بنجاح إلى الروم ${settings.gateB}`);
    } catch (err) {
        console.error("❌ فشل الإرسال:", err.message);
    }
};

service.on('ready', () => {
    console.log(`✅ البوت جاهز ويعمل بحساب: ${service.currentSubscriber.nickname}`);
});

// مراقبة رسائل المجموعة
service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    // 1. التحقق من وجود العبارة المطلوبة في الروم المحدد
    if (message.targetGroupId === settings.gateB && text.includes("اكتب {الان} بعد مرور")) {
        
        // 2. استخراج الرقم من النص (مثلاً استخراج 11 من "بعد مرور 11 ثانية")
        const match = text.match(/\d+/);
        const secondsToWait = match ? parseInt(match[0]) : 11; // الافتراضي 11 إذا فشل الاستخراج

        console.log(`🎯 رصدت العبارة! الانتظار لمدة ${secondsToWait} ثانية قبل الإرسال...`);

        // 3. ضبط المؤقت الزمني
        setTimeout(async () => {
            console.log("⏱️ انتهى الوقت! جاري الإرسال الآن...");
            await executeAction();
        }, secondsToWait * 1000); // تحويل الثواني إلى ملي ثانية
    }
});

service.login(settings.identity, settings.secret);
