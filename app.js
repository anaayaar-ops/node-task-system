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
    console.log("--- 🔍 استكشاف الدوال المتاحة في المكتبة ---");

    // 1. عرض جميع خصائص ودوال كائن الخدمة الرئيسي
    console.log("Main Service Keys:", Object.keys(service));

    // 2. عرض دوال المستخدم/المشترك (المكان المحتمل لتغيير الحالة)
    if (service.subscriber) {
        console.log("Subscriber Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(service.subscriber())));
    }
    
    if (service.currentSubscriber) {
        console.log("CurrentSubscriber Keys:", Object.keys(service.currentSubscriber));
    }

    // 3. عرض دوال الـ Utility (تستخدم غالباً في الإصدارات الحديثة للتحديثات)
    if (service.utility) {
        console.log("Utility Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(service.utility())));
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
