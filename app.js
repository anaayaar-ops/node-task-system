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
    console.log(`✅ تم تسجيل الدخول: ${service.currentSubscriber.nickname}`);
    console.log(`👀 يراقب الآن الروم: ${settings.groupId}`);
    console.log("------------------------------------------");
});

// مراقبة رسائل المجموعات
service.on('groupMessage', async (message) => {
    const text = (message.content || message.body || "").trim();

    // التحقق من رقم الروم ومحتوى الرسالة
    if (message.targetGroupId === settings.groupId && text === settings.targetTrigger) {
        
        console.log(`🎯 تم رصد الهدف في الروم [${message.targetGroupId}]`);
        
        try {
            // التصحيح هنا: إضافة الأقواس () بعد كلمة messaging
            await service.messaging().sendGroupMessage(settings.groupId, settings.actionResponse);
            console.log(`🚀 تم الإرسال بنجاح: ${settings.actionResponse}`);
        } catch (err) {
            console.error("❌ فشل الإرسال رغم التصحيح:", err.message);
        }
    }
});

// التعامل مع أخطاء الاتصال المفاجئة
service.on('error', (err) => {
    console.error("⚠️ خطأ في السيرفر:", err.message);
});

service.login(settings.identity, settings.secret);
