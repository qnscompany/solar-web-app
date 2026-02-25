'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Star, ChevronLeft, CheckCircle2, AlertCircle, Calendar, Quote, Shield } from 'lucide-react';

interface PostDetail {
    id: string;
    title: string;
    content: string;
    pros: string;
    cons: string;
    rating: number;
    created_at: string;
    company_name: string;
    images: { storage_path: string }[];
}

export default function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            const { data, error } = await supabase
                .from('experience_posts')
                .select(`
                    *,
                    company_profiles (company_name),
                    experience_post_images (storage_path)
                `)
                .eq('id', id)
                .single();

            if (data) {
                setPost({
                    ...data,
                    company_name: (data.company_profiles as any)?.company_name || '알 수 없는 업체',
                    images: data.experience_post_images || []
                });
            }
            setLoading(false);
        }
        fetchPost();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-xl font-medium">내용을 불러오는 중...</div>;
    if (!post) return <div className="p-8 text-center text-xl font-medium text-red-500">게시글을 찾을 수 없습니다.</div>;

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-16">
            <div className="mx-auto max-w-4xl px-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 font-black transition-colors">
                    <ChevronLeft className="w-5 h-5" /> 리스트로 돌아가기
                </button>

                <article className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-10 md:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{post.company_name} 시공</span>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < post.rating ? 'fill-current' : 'text-slate-700'}`} />
                                ))}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{post.title}</h1>
                        <div className="flex items-center gap-6 text-slate-400 text-sm font-bold">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2 text-blue-400"><Shield className="w-4 h-4" /> 주민 인증 완료</span>
                        </div>
                    </div>

                    <div className="p-10 md:p-12">
                        {/* Images */}
                        {post.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                                {post.images.map((img, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden aspect-square border border-slate-100 shadow-sm">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/experience-images/${img.storage_path}`}
                                            alt={`experience-${i}`}
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pros & Cons */}
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100/50">
                                <h3 className="text-blue-600 font-black mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
                                    <CheckCircle2 className="w-5 h-5" /> 좋았던 점
                                </h3>
                                <p className="text-slate-700 font-bold leading-relaxed">{post.pros || '내용 없음'}</p>
                            </div>
                            <div className="bg-orange-50/50 p-8 rounded-3xl border border-orange-100/50">
                                <h3 className="text-orange-600 font-black mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
                                    <AlertCircle className="w-5 h-5" /> 아쉬운 점
                                </h3>
                                <p className="text-slate-700 font-bold leading-relaxed">{post.cons || '내용 없음'}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative">
                            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-slate-100" />
                            <div className="relative z-10 text-slate-800 text-lg font-medium leading-[1.8] whitespace-pre-wrap">
                                {post.content}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}
