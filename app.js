import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    groupId: parseInt(process.env.EXIT_P), // الروم المراد مراقبته
    targetTrigger: "!س جلد خاص 51660277",   // النص المراد رصده
    actionResponse: "!س جلد"                // الرد الذي سيرسله البوت
};

const service = new WOLF();

service.on('ready', () => {
    console.log("------------------------------------------");
    console.log(`✅ البوت جاهز ويعمل بحساب: ${service.currentSubscriber.nickname}`);
    console.log(`👀 يراقب الآن: ${settings.groupId}`);
    console.log("------------------------------------------");
});

// مراقبة رسائل المجموعات
service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    // التحقق من رقم الروم ومحتوى الرسالة
    if (message.targetGroupId === settings.groupId && text.trim() === settings.targetTrigger) {
        
        console.log(`🎯 تم رصد الأمر في الروم [${message.targetGroupId}]`);
        
        try {
            await service.messaging().sendGroupMessage(settings.groupId, settings.actionResponse);
            console.log(`🚀 تم إرسال: ${settings.actionResponse}`);
        } catch (err) {
            console.error("❌ فشل إرسال الرد:", err.message);
        }
    }
});

service.login(settings.identity, settings.secret);
