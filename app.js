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
    console.log(`✅ البوت متصل الآن: ${service.currentSubscriber.nickname}`);

    try {
        // هذه هي الطريقة الخام (Raw) الوحيدة التي سيفهمها السيرفر في إصدارك
        // لتغيير لون النقطة إلى الأحمر (Busy)
        await service.websocket.emit('subscriber profile update', {
            onlineState: 2 // 2 هو كود اللون الأحمر في وولف
        });
        
        // مسح أي نص قديم كتبناه بالخطأ في نص الحالة
        await service.websocket.emit('subscriber profile update', {
            status: "" 
        });

        console.log("🔴 تم تحويل الحالة إلى مشغول (نقطة حمراء)");
    } catch (e) {
        console.log("❌ خطأ في السيرفر عند تغيير الحالة.");
    }
    console.log("==========================================");
});

// استخدمنا 'message' لأن الفحص أظهر أنه الحدث الوحيد المتاح للاستلام
service.on('message', async (message) => {
    // التحقق من الروم
    const targetId = message.targetGroupId || message.recipientId;
    
    if (targetId === settings.groupId) {
        const text = (message.content || message.body || "").trim();

        // فحص المطابقة للجلد
        if (text === settings.targetTrigger) {
            try {
                // استخدام sendGroupMessage كما ظهرت في الفحص
                await service.messaging.sendGroupMessage(settings.groupId, settings.actionResponse);
                console.log("🚀 تم الجلد بنجاح!");
            } catch (err) {
                console.error("❌ فشل الإرسال:", err.message);
            }
        }
    }
});

service.login(settings.identity, settings.secret);
