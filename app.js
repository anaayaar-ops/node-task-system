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
    try {
        // محاولة تغيير الحالة باستخدام تحديث الملف الشخصي مباشرة
        // الرقم 2 يعبر غالباً عن حالة "مشغول" في بروتوكول وولف
        await service.subscriber().update({
            status: 2 
        });
        
        console.log("------------------------------------------");
        console.log(`✅ تم تسجيل الدخول: ${service.currentSubscriber.nickname}`);
        console.log(`🔴 الحالة الآن: مشغول (Busy)`);
        console.log("------------------------------------------");
    } catch (err) {
        // إذا فشلت الطريقة أعلاه، نحاول الطريقة البديلة
        try {
             await service.currentSubscriber.setStatus(2);
             console.log("🔴 تم تحديث الحالة للطريقة البديلة");
        } catch (innerErr) {
             console.error("❌ تعذر تغيير الحالة برمجياً في هذا الإصدار:", innerErr.message);
        }
    }
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
