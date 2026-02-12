import 'dotenv/config';
import { WOLFBot } from 'wolf.js';

/**
 * إعدادات المحرك: يتم استدعاء القيم من Secrets/Env لضمان التمويه
 */
const SYSTEM_CONFIG = {
    identity: process.env.U_MAIL,
    access: process.env.U_PASS,
    gate_in: parseInt(process.env.ENTRY_P),
    gate_out: parseInt(process.env.EXIT_P),
    trigger_signal: process.env.MATCH_V,
    command_exec: process.env.EXEC_V,
    // مدة الدورة: 180 دقيقة (3 ساعات) محسوبة بالملي ثانية
    session_limit: (100 + 80) * 60 * 1000 
};

const engine = new WOLFBot();

/**
 * حدث التشغيل: يظهر رسالة عامة عند بدء الخدمة
 */
engine.on.ready(() => {
    console.log(`[${new Date().toLocaleTimeString()}] System: Operation started. Monitoring active.`);
});

/**
 * مراقب الإشارات: يستمع للرسائل الخاصة وينفذ المهمة عند المطابقة
 */
engine.on.privateMessage(async (data) => {
    try {
        // التحقق من المصدر ومحتوى الإشارة الواردة
        if (data.authorId === SYSTEM_CONFIG.gate_in && data.content.includes(SYSTEM_CONFIG.trigger_signal)) {
            
            console.log(`[${new Date().toLocaleTimeString()}] Signal: Pattern matched. Deploying action...`);

            // إرسال الأمر للوجهة المحددة
            await engine.messaging().sendGroupMessage(SYSTEM_CONFIG.gate_out, SYSTEM_CONFIG.command_exec);
            
            console.log(`[${new Date().toLocaleTimeString()}] Result: Action deployed successfully.`);
        }
    } catch (error) {
        // إدارة الأخطاء بصمت للحفاظ على استقرار النظام
    }
});

/**
 * مؤقت الإغلاق الذاتي: ينهي العملية بعد 3 ساعات بالضبط
 */
setTimeout(() => {
    console.log(`[${new Date().toLocaleTimeString()}] Session: Time limit reached. System entering rest mode.`);
    process.exit(0);
}, SYSTEM_CONFIG.session_limit);

/**
 * تسجيل الدخول وبدء التنفيذ
 */
engine.login(SYSTEM_CONFIG.identity, SYSTEM_CONFIG.access);
