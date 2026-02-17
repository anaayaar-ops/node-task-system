import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    groupId: parseInt(process.env.EXIT_P), 
    targetTrigger: "!س جلد خاص 51660277",   
    actionResponse: "!س جلد"                
};

const service = new WOLF();

service.on('ready', () => {
    console.log("------------------------------------------");
    console.log(`✅ تم تسجيل الدخول باسم: ${service.currentSubscriber.nickname}`);
    console.log(`👀 مراقبة الروم: ${settings.groupId}`);
    console.log("------------------------------------------");
});

service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    // التأكد من أن الرسالة من الروم المطلوب وتطابق النص
    if (message.targetGroupId === settings.groupId && text.trim() === settings.targetTrigger) {
        
        console.log("🎯 رصدت الأمر! جاري الإرسال...");

        // تأخير بسيط 500 ملي ثانية لتجنب إلغاء العملية من السيرفر
        setTimeout(async () => {
            try {
                // لاحظ الأقواس بعد messaging
                await service.messaging().sendGroupMessage(settings.groupId, settings.actionResponse);
                console.log(`🚀 تم الجلد بنجاح في [${settings.groupId}]`);
            } catch (err) {
                console.error("❌ خطأ أثناء الإرسال:", err.message);
            }
        }, 500); 
    }
});

// معالجة أخطاء النظام العامة لمنع توقف البوت
service.on('error', (err) => {
    console.error("⚠️ خطأ في الاتصال:", err.message);
});

service.login(settings.identity, settings.secret);
