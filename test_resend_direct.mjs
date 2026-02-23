import { Resend } from 'resend';

// node --env-file=.env.local test_resend_direct.mjs 명령어로 실행하세요.
const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
    console.log('Testing Resend API with Key:', process.env.RESEND_API_KEY?.substring(0, 7) + '...');
    try {
        const { data, error } = await resend.emails.send({
            from: 'Solar App <onboarding@resend.dev>',
            to: 'qnscompany88@gmail.com',
            subject: 'Resend API 작동 테스트 (Antigravity)',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #2563eb;">성공! 🚀</h1>
                    <p>이 메일이 도착했다면 Resend API 연동은 완벽합니다.</p>
                    <p style="color: #666; font-size: 12px;">발송 시각: ${new Date().toLocaleString('ko-KR')}</p>
                </div>
            `
        });

        if (error) {
            console.error('❌ API Error Reply:', error);
        } else {
            console.log('✅ Success! Email sent:', data);
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
}

testResend();
