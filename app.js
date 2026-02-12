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
    notifyMsg: process.env.NOTIFY_MSG || "✅ تم تخطي وقت الانتظار وإعادة اللعب بنجاح!"
};

const service = new WOLF();
let myId = null;

// دالة الإرسال
const sendCommand = async (isRetry = false) => {
    try {
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم تنفيذ الأمر: [${settings.action}]`);
        
        if (isRetry) {
            await service.messaging().sendPrivateMessage(settings.gateA, settings.notifyMsg);
        }
    } catch (err) {
        console.log("❌ فشل في الإرسال:", err.message);
    }
};

service.on('ready', async () => {
    try {
        // تصحيح جلب الـ ID: في بعض الإصدارات تكون الخاصية مباشرة
        const me = await service.subscriber().current();
        myId = me.id;

        // تغيير الحالة إلى مشغول (2 = Busy)
        await service.updatePresence(2);
        
        console.log(`------------------------------------------`);
        console.log(`✅ البوت متصل | العضوية: [${myId}]`);
        console.log(`✅ الحالة: [مشغول] | الروم المستهدف: [${settings.gateB}]`);
        console.log(`------------------------------------------`);
    } catch (err) {
        console.log("⚠️ فشل جلب بيانات الحساب، لكن البوت سيستمر...");
    }
});

service.on('groupMessage', async (message) => {
    // حماية للتأكد من وجود نص في الرسالة لتجنب خطأ (includes)
    const text = message.content || "";
    if (!text) return;

    // التحقق من النص ورقم العضوية (إذا تم جلبه)
    if (message.targetGroupId === settings.gateB && text.includes("ما زال السباق جاريًا")) {
        
        // التحقق من ID العضوية داخل النص لضمان أنها لك
        if (myId && text.includes(myId.toString())) {
            const match = text.match(/\d+/);
            const waitSeconds = match ? parseInt(match[0]) : 15;
            
            console.log(`⚠️ تنبيه: السباق مستمر لي (ID: ${myId}). سأنتظر ${waitSeconds} ثانية...`);

            setTimeout(async () => {
                console.log(`🔄 انتهى الانتظار. إعادة اللعب الآن...`);
                await sendCommand(true);
            }, (waitSeconds + 1) * 1000);
        }
    }
});

service.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    const text = message.content || "";
    
    if (senderId === settings.gateA && text.includes(settings.trigger)) {
        console.log("🎯 إشارة طاقة واردة! جاري بدء اللعب...");
        await sendCommand(false);
    }
});

service.login(settings.identity, settings.secret);
