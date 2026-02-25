'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Star, MessageSquare, Camera, Plus, ChevronRight, User, MapPin } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    content: string;
    rating: number;
    created_at: string;
    user_id: string;
    company_name: string;
    company_address: string;
    image_count: number;
}

export default function ExperienceBoardPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkAuthAndFetch() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }
            setIsAuthenticated(true);

            const { data, error } = await supabase
                .from('experience_posts')
                .select(`
                    id,
                    title,
                    content,
                    rating,
                    created_at,
                    user_id,
                    company_profiles (company_name, headquarters_address),
                    experience_post_images (count)
                `)
                .order('created_at', { ascending: false });

            if (data) {
                setPosts(data.map(p => ({
                    ...p,
                    company_name: (p.company_profiles as any)?.company_name || '알 수 없는 업체',
                    company_address: (p.company_profiles as any)?.headquarters_address || '',
                    image_count: (p.experience_post_images as any)?.[0]?.count || 0
                })));
            }
            setLoading(false);
        }
        checkAuthAndFetch();
    }, []);

    if (loading) return <div className="p-8 text-center text-xl font-medium">로딩 중...</div>;

    if (isAuthenticated === false) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <User className="w-10 h-10 text-slate-400" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-4">로그인이 필요한 페이지입니다</h1>
                <p className="text-slate-500 mb-8 max-w-md">실제 시공 경험을 공유하고 확인하시려면 로그인이 필요합니다.</p>
                <Link href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
                    로그인하러 가기
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-16">
            <div className="mx-auto max-w-5xl px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-4">시공 경험 게시판</h1>
                        <p className="text-slate-500 text-lg font-medium italic">"주민들이 직접 겪은 생생한 시공 스토리를 만나보세요."</p>
                    </div>
                    <Link href="/experience/new" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        <Plus className="w-5 h-5" /> 경험 공유하기
                    </Link>
                </div>

                <div className="grid gap-6">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.id} href={`/experience/${post.id}`} className="block bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:translate-y-[-4px] group">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{post.company_name}</span>
                                            {post.company_address && (
                                                <span className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                                                    <MapPin className="w-3 h-3" /> {post.company_address.split(' ').slice(0, 2).join(' ')}
                                                </span>
                                            )}
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < post.rating ? 'fill-current' : 'text-slate-100'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                                    </div>
                                    <span className="text-slate-400 text-sm font-bold">{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 line-clamp-2 mb-8 font-medium leading-relaxed">{post.content}</p>
                                <div className="flex items-center gap-6 text-slate-400 text-xs font-black border-t border-slate-50 pt-6">
                                    {post.image_count > 0 && (
                                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                                            <Camera className="w-3.5 h-3.5" /> 사진 {post.image_count}장
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare className="w-3.5 h-3.5" /> 상세 보기
                                    </span>
                                    <div className="ml-auto flex items-center text-blue-600 font-black">
                                        내용 확인하기 <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center">
                            <p className="text-slate-400 text-lg font-medium">아직 올라온 경험담이 없습니다.<br />첫 번째 주인공이 되어보세요!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
