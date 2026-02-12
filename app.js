import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateA: parseInt(process.env.ENTRY_P), 
    gateB: parseInt(process.env.EXIT_P),  
    trigger: process.env.MATCH_V,         
    action: process.env.EXEC_V            
};

const service = new WOLF();

service.on('ready', () => {
    console.log("------------------------------------------");
    console.log("✅ System Online: Monitoring Signals...");
    console.log("------------------------------------------");
});

service.on('privateMessage', async (message) => {
    try {
        const senderId = message.authorId || message.sourceSubscriberId;
        const text = message.content || message.body || "";

        if (senderId === settings.gateA && text.includes(settings.trigger)) {
            console.log("🎯 Match Found! Deploying action...");
            
            // التعديل هنا: الوصول المباشر لدالة الإرسال حسب الإصدار الأخير
            await service.messaging.sendGroupMessage(settings.gateB, settings.action);
            
            console.log(`🚀 Success: Command [${settings.action}] sent to [${settings.gateB}]`);
        }
    } catch (err) {
        // إذا فشلت الطريقة الأولى، نجرب الطريقة البديلة للإرسال
        try {
            await service.messaging().sendGroupMessage(settings.gateB, settings.action);
            console.log(`🚀 Success (Alt Method): Command sent.`);
        } catch (innerErr) {
            console.log("❌ Final Send Error:", innerErr.message);
        }
    }
});

service.login(settings.identity, settings.secret);
