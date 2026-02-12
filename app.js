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
    notifyMsg: process.env.NOTIFY_MSG || "✅ تم إعادة اللعب بنجاح!",
    myId: "80055399" // ضع رقم عضويتك هنا مباشرة بين الفواصل
};

const service = new WOLF();

const sendCommand = async (isRetry = false) => {
    try {
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم إرسال الأمر: [${settings.action}]`);
        
        if (isRetry) {
            await service.messaging().sendPrivateMessage(settings.gateA, settings.notifyMsg);
        }
    } catch (err) {
        console.log("❌ فشل الإرسال:", err.message);
    }
};

service.on('ready', async () => {
    try {
        // محاولة تغيير الحالة فقط
        await service.updatePresence(2);
        console.log(`✅ البوت متصل ومستعد | المعرف المعتمد: [${settings.myId}] | الحالة: [مشغول]`);
    } catch (err) {
        console.log("✅ متصل (تعذر تغيير الحالة لكن العمل مستمر)");
    }
});

service.on('groupMessage', async (message) => {
    const text = message.content || "";
    if (!text) return;

    // التحقق من نص السباق ووجود رقم معرفك في الرسالة
    if (message.targetGroupId === settings.gateB && 
        text.includes("ما زال السباق جاريًا") && 
        text.includes(settings.myId)) {
        
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 25;
        
        console.log(`⚠️ الرسالة موجهة لي. سأنتظر ${waitSeconds} ثانية...`);

        setTimeout(async () => {
            console.log(`🔄 انتهى الانتظار. إعادة المحاولة الآن...`);
            await sendCommand(true);
        }, (waitSeconds + 1) * 1000);
    }
});

service.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    const text = message.content || "";
    
    if (senderId === settings.gateA && text.includes(settings.trigger)) {
        console.log("🎯 إشارة طاقة واردة! جاري التنفيذ...");
        await sendCommand(false);
    }
});

service.login(settings.identity, settings.secret);
