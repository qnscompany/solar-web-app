'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Camera, AlertCircle, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';

interface Company {
    id: string;
    company_name: string;
}

export default function NewExperiencePage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        company_id: '',
        title: '',
        content: '',
        pros: '',
        cons: '',
        rating: 5
    });

    useEffect(() => {
        async function fetchCompanies() {
            const { data } = await supabase.from('company_profiles').select('id, company_name');
            setCompanies(data || []);
            setLoading(false);
        }
        fetchCompanies();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).slice(0, 3 - files.length);
            const newFiles = [...files, ...selectedFiles];
            setFiles(newFiles);

            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('로그인이 필요합니다.');

            // 1. Insert Post
            const { data: post, error: postError } = await supabase
                .from('experience_posts')
                .insert({
                    ...form,
                    user_id: user.id
                })
                .select()
                .single();

            if (postError) throw postError;

            // 2. Upload Images
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${post.id}/${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('experience-images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // 3. Insert Image Record
                await supabase.from('experience_post_images').insert({
                    post_id: post.id,
                    storage_path: fileName
                });
            }

            router.push('/experience');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-xl font-medium">폼 불러오는 중...</div>;

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-16">
            <div className="mx-auto max-w-3xl px-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 font-black transition-colors">
                    <ChevronLeft className="w-5 h-5" /> 뒤로 가기
                </button>

                <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">시공 경험 공유하기</h1>
                    <p className="text-slate-400 font-bold mb-10 italic">솔직한 후기가 큰 도움이 됩니다.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">시공 업체 선택 *</label>
                            <select
                                required
                                value={form.company_id}
                                onChange={e => setForm({ ...form, company_id: e.target.value })}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-500 focus:outline-none transition-all appearance-none"
                            >
                                <option value="">업체를 선택해 주세요</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.company_name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">후기 제목 *</label>
                            <input
                                required
                                type="text"
                                placeholder="예: 시공 과정이 투명해서 너무 좋았습니다!"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">평점 *</label>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setForm({ ...form, rating: num })}
                                        className={`w-12 h-12 rounded-xl font-black transition-all ${form.rating === num ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-black text-slate-900 mb-3 text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" /> 좋았던 점
                                </label>
                                <textarea
                                    placeholder="상담 친절도, 공사 전문성 등"
                                    value={form.pros}
                                    onChange={e => setForm({ ...form, pros: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-500 focus:outline-none transition-all min-h-[120px]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-900 mb-3 text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4" /> 아쉬운 점
                                </label>
                                <textarea
                                    placeholder="뒷정리, 연락 누락 등"
                                    value={form.cons}
                                    onChange={e => setForm({ ...form, cons: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-500 focus:outline-none transition-all min-h-[120px]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">전체 내용 *</label>
                            <textarea
                                required
                                placeholder="견적 신청부터 시공 후 정산 과정까지 느낀 점을 자유롭게 적어주세요."
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-500 focus:outline-none transition-all min-h-[200px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider flex items-center justify-between">
                                사진 업로드 (최대 3장)
                                <span className="text-[10px] text-slate-400">{files.length}/3장</span>
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {previews.map((preview, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 group">
                                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                                {files.length < 3 && (
                                    <label className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                                        <Camera className="w-6 h-6 text-slate-400 mb-1" />
                                        <span className="text-[10px] text-slate-400 font-bold">추가</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '후기 등록하기'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
