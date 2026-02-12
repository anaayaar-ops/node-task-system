import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateA: parseInt(process.env.ENTRY_P), 
    gateB: parseInt(process.env.EXIT_P),  
    trigger: process.env.MATCH_V,         
    action: process.env.EXEC_V,
    notifyMsg: process.env.NOTIFY_MSG || "✅ تم تنفيذ الهجوم بنجاح بعد الانتظار!"
};

const service = new WOLF();
let myId = null;

// دالة الإرسال مع نظام التنبيه
const sendCommand = async (isRetry = false) => {
    try {
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم إرسال الأمر: [${settings.action}]`);
        
        // إرسال تنبيه في الخاص عند النجاح بعد إعادة المحاولة
        if (isRetry) {
            await service.messaging().sendPrivateMessage(settings.gateA, settings.notifyMsg);
        }
    } catch (err) {
        console.log("❌ فشل الإرسال:", err.message);
    }
};

service.on('ready', async () => {
    // جلب بيانات البوت وتخزين رقم العضوية
    const currentUser = await service.currentSubscriber();
    myId = currentUser.id;

    // تغيير حالة الحساب إلى "مشغول" (القيمة 2 تعني Busy)
    await service.updatePresence(2);
    
    console.log(`✅ البوت متصل | العضوية: [${myId}] | الحالة: [مشغول] | الروم: [${settings.gateB}]`);
});

service.on('groupMessage', async (message) => {
    const text = message.content || "";

    // التحقق من الروم + جملة انشغال السباق + التأكد أن الرسالة موجهة لرقم عضوية البوت
    if (message.targetGroupId === settings.gateB && 
        text.includes("ما زال السباق جاريًا") && 
        text.includes(myId.toString())) {
        
        // استخراج الثواني المطلوبة للانتظار
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 10;
        
        console.log(`⚠️ الرسالة موجهة لي. سأنتظر ${waitSeconds} ثانية قبل إعادة المحاولة...`);

        setTimeout(async () => {
            console.log("🔄 إعادة المحاولة الآن...");
            await sendCommand(true);
        }, (waitSeconds + 1) * 1000); // أضفنا ثانية أمان
    }
});

service.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    
    // استقبال إشارة اكتمال الطاقة من الحساب المصدر
    if (senderId === settings.gateA && message.content.includes(settings.trigger)) {
        console.log("🎯 رصد إشارة طاقة. جاري الهجوم...");
        await sendCommand(false);
    }
});

service.login(settings.identity, settings.secret);
