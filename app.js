import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    groupId: parseInt(process.env.EXIT_P), 
    targetTrigger: "!س جلد خاص 51660277 80055399",   
    actionResponse: "!س جلد"                
};

const service = new WOLF();

service.on('ready', async () => {
    // محاولة تغيير الحالة بأمر مباشر للسيرفر (بدون الحاجة لدوال معقدة)
    try {
        await service.utility().updateSubscriber({ status: 2 }); 
        console.log("🔴 تم تثبيت الحالة: مشغول");
    } catch (e) {
        // إذا لم تنجح، نحاول الطريقة المختصرة
        service.currentSubscriber.status = 2;
        console.log("⚠️ تم تحديث الحالة داخلياً");
    }

    console.log("------------------------------------------");
    console.log(`✅ البوت يعمل الآن باسم: ${service.currentSubscriber.nickname}`);
    console.log("------------------------------------------");
});
service.on('groupMessage', async (message) => {
    const text = (message.content || message.body || "").trim();

    if (message.targetGroupId === settings.groupId && text === settings.targetTrigger) {
        
        console.log(`🎯 تم رصد الهدف! جاري محاولة الإرسال...`);
        
        try {
            // محاولة الطريقة الأولى (كـ دالة)
            if (typeof service.messaging === 'function') {
                await service.messaging().sendGroupMessage(settings.groupId, settings.actionResponse);
            } 
            // محاولة الطريقة الثانية (كـ خاصية)
            else if (service.messaging && typeof service.messaging.sendGroupMessage === 'function') {
                await service.messaging.sendGroupMessage(settings.groupId, settings.actionResponse);
            }
            // محاولة الطريقة الثالثة (في الإصدارات القديمة جداً)
            else if (service.messages && typeof service.messages.sendGroupMessage === 'function') {
                await service.messages.sendGroupMessage(settings.groupId, settings.actionResponse);
            }
            
            console.log(`🚀 تم الإرسال بنجاح!`);
        } catch (err) {
            console.error("❌ فشل الإرسال النهائي:", err.message);
        }
    }
});

service.login(settings.identity, settings.secret);
