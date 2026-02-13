import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;
const service = new WOLF();

async function start() {
    console.log("🛠️ جاري محاولة الدخول القسري لرفع الفعالية...");

    try {
        // قمنا بتغيير الرقم الأخير إلى 2 (ليظهر كجهاز آيفون) لتجاوز تعارض الجلسات
        const loginResponse = await service.login("mona2468@gmail.com", "As1412as", 2);

        if (loginResponse.success) {
            console.log("✅ تم اختراق الحاجز والدخول بنجاح!");

            const response = await service.websocket.emit('group event create', {
                id: 66266,
                title: "فعاليات مبرمجة",
                description: "تم الرفع بنجاح",
                startsAt: new Date(2026, 1, 22, 15, 45, 0).toISOString(),
                endsAt: new Date(2026, 1, 22, 16, 30, 0).toISOString(),
                columnId: 10
            });

            if (response.success) {
                console.log("🎯 مبروك! تم رفع الفعالية. ID:", response.body.id);
            } else {
                console.log("❌ فشل الرفع. السبب:", response.headers?.reason);
            }
        } else {
            console.log("❌ السيرفر لا يزال يرفض.");
            console.log("🔍 السبب التقني:", loginResponse.headers?.reason || "جلسة نشطة أخرى");
            console.log("💡 نصيحة: إذا كنت تستخدم Replit، تأكد من عمل Stop ثم Run.");
        }
    } catch (err) {
        console.error("⚠️ خطأ:", err.message);
    }
    
    process.exit(); 
}

start();
