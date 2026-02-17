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

// التعديل هنا: نمرر إعدادات تمنع تحديث الحالة التلقائي عند الدخول
const service = new WOLF({
    presence: {
        onlineState: 2 // نطلب من المكتبة الدخول مباشرة بحالة "مشغول" 
    }
});

service.on('ready', () => {
    console.log("==========================================");
    console.log(`✅ البوت متصل الآن باسم: ${service.currentSubscriber.nickname}`);
    console.log(`🛠️ تم طلب الدخول بحالة 'مشغول' تلقائياً.`);
    console.log("==========================================");
});

service.on('message', async (message) => {
    const targetId = message.targetGroupId || message.recipientId;

    if (targetId === settings.groupId) {
        const text = (message.content || message.body || "").trim();

        if (text === settings.targetTrigger) {
            try {
                await service.messaging.sendGroupMessage(settings.groupId, settings.actionResponse);
                console.log(`🚀 تم الجلد بنجاح!`);
            } catch (err) {
                console.error("❌ فشل الإرسال:", err.message);
            }
        }
    }
});

service.login(settings.identity, settings.secret);
