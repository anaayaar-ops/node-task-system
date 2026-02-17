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
    console.log("==========================================");
    console.log(`✅ البوت متصل باسم: ${service.currentSubscriber.nickname}`);

    try {
        // تحديث الحالة للأيقونة الحمراء (onlineState) ومسح النص (status)
        await service.websocket.emit('subscriber profile update', {
            onlineState: 2, // اللون الأحمر
            status: ""      // مسح رقم 2 من النص
        });
        console.log("🔴 الحالة: مشغول (أيقونة حمراء)");
    } catch (e) {
        console.log("⚠️ فشل تحديث الحالة، لكن العمل مستمر.");
    }
    console.log("==========================================");
});

// الاعتماد على حدث 'message' كما ظهر في الفحص
service.on('message', async (message) => {
    // التحقق من أن الرسالة من المجموعة المطلوبة
    const targetId = message.targetGroupId || message.recipientId;
    const isGroup = message.isGroup || !!message.targetGroupId;

    if (isGroup && targetId === settings.groupId) {
        const text = (message.content || message.body || "").trim();
        
        // طباعة الرسائل في الكونسول للتأكد من القراءة
        console.log(`📩 رسالة مستلمة: [${text}]`);

        if (text === settings.targetTrigger) {
            console.log("🎯 تم رصد الهدف! جاري الرد...");
            try {
                // الوصول للدالة كما ظهرت في الفحص: sendGroupMessage
                const msgService = typeof service.messaging === 'function' ? service.messaging() : service.messaging;
                await msgService.sendGroupMessage(settings.groupId, settings.actionResponse);
                console.log("🚀 تم الجلد بنجاح!");
            } catch (err) {
                console.error("❌ فشل الإرسال برمجياً:", err.message);
            }
        }
    }
});

service.on('error', (err) => console.error("⚠️ خطأ اتصالي:", err.message));

service.login(settings.identity, settings.secret);
