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
    console.log("------------------------------------------");
    console.log(`✅ تم تسجيل الدخول: ${service.currentSubscriber.nickname}`);

    try {
        // الطريقة الوحيدة المتبقية وهي إرسال "طلب خام" للسيرفر لتغيير الحالة
        // 2 تعني مشغول، 5 تعني مخفي
        await service.websocket.emit('subscriber profile update', {
            status: 2
        });
        console.log("🔴 تم إرسال طلب الحالة: مشغول (Busy)");
    } catch (err) {
        // محاولة بديلة عبر خاصية التواجد
        try {
            await service.websocket.emit('presence update', {
                status: 2
            });
            console.log("🔴 تم تحديث الحالة عبر Presence");
        } catch (e) {
            console.log("⚠️ السيرفر لم يستجب لطلب تغيير الحالة، سيستمر البوت في العمل.");
        }
    }

    console.log(`👀 يراقب الروم: ${settings.groupId}`);
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
