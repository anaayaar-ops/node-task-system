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

service.on('ready', () => {
    console.log("--- 🔍 محاولة الوصول للدوال الصحيحة ---");

    try {
        // 1. استكشاف كائن المشترك (Subscriber)
        if (service.subscriber) {
            console.log("Subscriber Keys:", Object.keys(service.subscriber));
            // عرض الدوال المخفية داخل البروتوتايب
            console.log("Subscriber Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(service.subscriber)));
        }

        // 2. استكشاف كائن الأدوات (Utility)
        if (service.utility) {
            console.log("Utility Keys:", Object.keys(service.utility));
            console.log("Utility Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(service.utility)));
        }
        
        // 3. استكشاف العضو الحالي (Current Subscriber)
        if (service.currentSubscriber) {
            console.log("CurrentSubscriber Keys:", Object.keys(service.currentSubscriber));
        }

    } catch (e) {
        console.log("❌ خطأ أثناء الاستكشاف:", e.message);
    }
    console.log("--- ✅ انتهى الاستكشاف ---");
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
