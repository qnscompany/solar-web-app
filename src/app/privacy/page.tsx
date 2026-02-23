import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '개인정보처리방침 | 쨍하고',
    description: '쨍하고 플랫폼의 개인정보 수집 및 이용에 관한 방침입니다.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-6">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-12 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    {"메인으로 돌아가기"}
                </Link>

                {/* Header */}
                <h1 className="text-3xl md:text-5xl font-black mb-4">
                    {"쨍하고 개인정보처리방침"}
                </h1>
                <p className="text-slate-400 font-bold mb-12">
                    {"시행일: 2026년 2월 23일"}
                </p>

                <div className="space-y-8 leading-relaxed text-slate-600">
                    <p className="font-medium">
                        {"쨍하고(이하 \"플랫폼\")는 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」을 준수합니다."}
                    </p>

                    <hr className="border-slate-100" />

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"1. 수집하는 개인정보 항목"}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold text-slate-800">{"[소비자(견적 요청자)]"}</p>
                                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                                    <li>{"필수: 이름, 연락처(전화번호), 설치 주소"}</li>
                                    <li>{"선택: 희망 설치 용량(kW)"}</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{"[시공업체 회원]"}</p>
                                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                                    <li>{"필수: 이메일, 비밀번호, 업체명, 사업자등록번호, 대표자 연락처, 사업장 주소"}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"2. 개인정보 수집 목적"}
                        </h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>{"소비자: 견적 요청 정보를 해당 시공업체에 전달하기 위한 목적으로만 사용"}</li>
                            <li>{"시공업체: 플랫폼 로그인 및 리드(견적 요청) 수신 서비스 제공"}</li>
                        </ul>
                        <p className="mt-4 p-4 bg-orange-50 rounded-xl text-orange-700 font-bold border border-orange-100">
                            {"⚠️ 플랫폼은 수집된 소비자 정보를 요청 업체 외 제3자에게 절대 판매하거나 제공하지 않습니다."}
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"3. 개인정보 보유 및 이용 기간"}
                        </h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>{"소비자 견적 정보: 견적 요청일로부터 1년 후 자동 삭제"}</li>
                            <li>{"시공업체 회원 정보: 회원 탈퇴 후 즉시 삭제 (단, 관련 법령에 따라 보존 필요 시 해당 기간 보관)"}</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"4. 개인정보의 제3자 제공"}
                        </h2>
                        <p>
                            {"플랫폼은 소비자가 선택한 시공업체에 한해 이름·연락처·설치 주소를 제공합니다."}
                        </p>
                        <p className="mt-2 text-slate-400 font-medium">
                            {"그 외 어떠한 제3자에게도 개인정보를 제공하지 않습니다."}
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"5. 개인정보 보호를 위한 기술적 조치"}
                        </h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>{"모든 데이터는 암호화된 서버(Supabase)에 저장"}</li>
                            <li>{"HTTPS 보안 통신 적용"}</li>
                            <li>{"비밀번호는 암호화(해시) 처리되어 저장되며 플랫폼 운영자도 확인 불가"}</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"6. 이용자의 권리"}
                        </h2>
                        <p className="mb-4">{"이용자는 언제든지 아래 권리를 행사할 수 있습니다."}</p>
                        <ul className="list-disc list-inside space-y-1 mb-6">
                            <li>{"개인정보 열람 요청"}</li>
                            <li>{"개인정보 수정 요청"}</li>
                            <li>{"개인정보 삭제 요청 (회원 탈퇴)"}</li>
                            <li>{"개인정보 처리 정지 요청"}</li>
                        </ul>
                        <p className="font-bold text-slate-900">{"문의: qnscompany88@gmail.com"}</p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"7. 개인정보 보호책임자"}
                        </h2>
                        <p>{"성명: 박규섭"}</p>
                        <p>{"연락처: qnscompany88@gmail.com"}</p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"8. 개인정보처리방침 변경 안내"}
                        </h2>
                        <p>{"본 방침을 변경할 경우, 시행 7일 전 플랫폼 공지사항을 통해 사전 안내합니다."}</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
