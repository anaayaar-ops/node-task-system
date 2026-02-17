import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    groupId: parseInt(process.env.EXIT_P), 
    targetTrigger: process.env.MATCH_V, 
    actionResponse: process.env.EXEC_V  
};

const service = new WOLF();

// عند الجاهزية: لن نقوم بتغيير الحالة نهائياً
service.on('ready', () => {
    console.log("==========================================");
    console.log(`✅ البوت يعمل الآن باسم: ${service.currentSubscriber.nickname}`);
    console.log(`👀 يراقب الروم: ${settings.groupId}`);
    console.log(`🛠️ الحالة: التحكم يدوي (لن يلمس البوت حالتك)`);
    console.log("==========================================");
});

// مراقبة الرسائل والرد
service.on('message', async (message) => {
    // تحديد معرف الروم (سواء كان targetGroupId أو recipientId)
    const targetId = message.targetGroupId || message.recipientId;

    // التأكد من أن الرسالة من الروم المطلوب
    if (targetId === settings.groupId) {
        const text = (message.content || message.body || "").trim();

        // إذا تطابق النص مع الأمر (الزناد)
        if (text === settings.targetTrigger) {
            console.log(`🎯 تم رصد الهدف: [${text}]`);
            try {
                // بناءً على فحصك: messaging كائن يحتوي على sendGroupMessage مباشرة
                await service.messaging.sendGroupMessage(settings.groupId, settings.actionResponse);
                console.log(`🚀 تم الإرسال بنجاح: ${settings.actionResponse}`);
            } catch (err) {
                console.error("❌ فشل الإرسال:", err.message);
            }
        }
    }
});

// معالجة الأخطاء لضمان عدم توقف البوت
service.on('error', (err) => {
    console.error("⚠️ خطأ في الاتصال:", err.message);
});

service.login(settings.identity, settings.secret);
