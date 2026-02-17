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

service.on('ready', async () => {
    console.log("------------------------------------------");
    console.log(`✅ تم تسجيل الدخول: ${service.currentSubscriber.nickname}`);

    try {
        // التصحيح النهائي: تغيير onlineState هو ما يجعل الأيقونة حمراء
        // الرقم 2 في onlineState يعني "مشغول" (اللون الأحمر)
        await service.websocket.emit('subscriber profile update', {
            onlineState: 2 
        });
        console.log("🔴 تم تغيير أيقونة الحالة إلى اللون الأحمر (مشغول)");
    } catch (err) {
        console.log("⚠️ فشل تغيير اللون، سيستمر البوت في الجلد.");
    }
    
    console.log(`👀 يراقب الروم: ${settings.groupId}`);
    console.log("------------------------------------------");
});

service.on('groupMessage', async (message) => {
    const text = (message.content || message.body || "").trim();

    if (message.targetGroupId === settings.groupId && text === settings.targetTrigger) {
        console.log(`🎯 تم رصد الهدف!`);
        try {
            const messaging = typeof service.messaging === 'function' ? service.messaging() : service.messaging;
            await messaging.sendGroupMessage(settings.groupId, settings.actionResponse);
            console.log(`🚀 تم الجلد بنجاح!`);
        } catch (err) {
            console.error("❌ فشل الإرسال:", err.message);
        }
    }
});

service.login(settings.identity, settings.secret);
