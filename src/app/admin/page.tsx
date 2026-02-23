import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminClient from '@/components/admin/AdminClient';

export default async function AdminPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // 1단계: 로그인 여부 확인 (미들웨어에서도 처리하지만 2중 보안)
    // 2단계: ADMIN_EMAIL 환경변수와 이메일 대조
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
        console.warn('Unauthorized admin access attempt:', user?.email);
        redirect('/');
    }

    return <AdminClient />;
}
