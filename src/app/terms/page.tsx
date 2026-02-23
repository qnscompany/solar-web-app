import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '이용약관 | 쨍하고',
    description: '쨍하고 플랫폼 서비스 이용에 관한 약관입니다.',
};

export default function TermsPage() {
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
                    {"쨍하고 이용약관"}
                </h1>
                <p className="text-slate-400 font-bold mb-12">
                    {"시행일: 2026년 2월 23일"}
                </p>

                <div className="space-y-8 leading-relaxed text-slate-600">
                    <hr className="border-slate-100" />

                    {/* Article 1 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제1조 (목적)"}
                        </h2>
                        <p>
                            {"본 약관은 쨍하고(이하 \"플랫폼\")가 제공하는 지역 태양광 시공업체 비교 및 무료 견적 연결 서비스의 이용 조건을 정합니다."}
                        </p>
                    </section>

                    {/* Article 2 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제2조 (서비스 내용)"}
                        </h2>
                        <p className="mb-4">{"플랫폼이 제공하는 서비스는 다음과 같습니다."}</p>
                        <ul className="list-decimal list-inside space-y-2 ml-2">
                            <li>{"소비자: 지역 내 검증된 태양광 시공업체 목록 열람 및 무료 견적 요청"}</li>
                            <li>{"시공업체: 파트너 등록 후 소비자 견적 요청(리드) 수신 및 관리"}</li>
                            <li>{"운영자: 입점 업체 심사 및 승인"}</li>
                        </ul>
                        <p className="mt-6 p-4 bg-blue-50 rounded-xl text-blue-700 font-bold border border-blue-100">
                            {"✅ 소비자는 회원가입 없이 무료로 서비스 이용이 가능합니다."}
                        </p>
                    </section>

                    {/* Article 3 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제3조 (시공업체 회원 가입)"}
                        </h2>
                        <ul className="list-decimal list-inside space-y-2 ml-2">
                            <li>{"시공업체는 사업자등록증 및 관련 면허 보유자에 한해 가입 신청 가능"}</li>
                            <li>{"플랫폼 운영자의 심사 및 승인 후 서비스 이용 가능"}</li>
                            <li>{"허위 정보로 가입한 경우 즉시 이용 정지 및 강제 탈퇴 처리"}</li>
                        </ul>
                    </section>

                    {/* Article 4 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제4조 (플랫폼의 역할과 한계)"}
                        </h2>
                        <ul className="list-decimal list-inside space-y-2 ml-2">
                            <li>{"플랫폼은 소비자와 시공업체를 연결하는 중개 서비스를 제공합니다."}</li>
                            <li>{"실제 시공 계약 및 하자 처리는 소비자와 시공업체 간의 책임입니다."}</li>
                            <li>{"플랫폼은 시공업체 검증을 성실히 수행하나, 시공 품질 및 계약 이행에 대한 직접적인 법적 책임은 지지 않습니다."}</li>
                        </ul>
                    </section>

                    {/* Article 5 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제5조 (금지 행위)"}
                        </h2>
                        <p className="mb-4">{"이용자는 다음 행위를 할 수 없습니다."}</p>
                        <ul className="list-decimal list-inside space-y-2 ml-2">
                            <li>{"허위 견적 요청 또는 허위 업체 정보 등록"}</li>
                            <li>{"타 이용자의 개인정보 무단 수집 및 활용"}</li>
                            <li>{"플랫폼 서비스를 통해 취득한 정보의 무단 상업적 이용"}</li>
                            <li>{"스팸, 도배, 악성코드 배포"}</li>
                        </ul>
                    </section>

                    {/* Article 6 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제6조 (서비스 이용 제한)"}
                        </h2>
                        <p className="mb-4">{"운영자는 다음의 경우 사전 통보 없이 이용을 제한할 수 있습니다."}</p>
                        <ul className="list-decimal list-inside space-y-2 ml-2">
                            <li>{"타인의 개인정보를 무단으로 이용하는 경우"}</li>
                            <li>{"허위 정보로 서비스를 이용하는 경우"}</li>
                            <li>{"플랫폼의 정상적인 운영을 방해하는 경우"}</li>
                        </ul>
                    </section>

                    {/* Article 7 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제7조 (면책 조항)"}
                        </h2>
                        <ul className="list-decimal list-inside space-y-2 ml-2">
                            <li>{"천재지변, 서버 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다."}</li>
                            <li>{"이용자 간 분쟁(계약 분쟁, 시공 하자 등)에 대해 플랫폼은 중재 노력을 기울이나 법적 책임을 지지 않습니다."}</li>
                        </ul>
                    </section>

                    {/* Article 8 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제8조 (약관 변경)"}
                        </h2>
                        <p>{"약관 변경 시 시행 7일 전 플랫폼 공지를 통해 안내합니다."}</p>
                    </section>

                    {/* Article 9 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 mt-8">
                            {"제9조 (준거법 및 관할법원)"}
                        </h2>
                        <p>{"본 약관은 대한민국 법령을 따르며, 분쟁 발생 시 플랫폼 운영자 소재지 관할 법원을 따릅니다."}</p>
                    </section>

                    <footer className="mt-12 pt-12 border-t border-slate-100">
                        <p className="font-bold text-slate-900">{"문의: qnscompany88@gmail.com"}</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
