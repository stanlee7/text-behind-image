import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
    title: '개인정보처리방침 - 누끼 텍스트',
    description: '누끼 텍스트의 개인정보처리방침입니다. 이미지 처리 방식, 쿠키 및 Google AdSense 광고, 수집 정보와 이용자 권리에 대해 안내합니다.',
    alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
    return (
        <PageShell title="개인정보처리방침" updatedAt="2026년 6월 22일">
            <p>
                누끼 텍스트(이하 &lsquo;서비스&rsquo;)는 이용자의 개인정보를 중요하게 생각하며, 관련 법령을
                준수합니다. 본 방침은 서비스가 어떤 정보를 어떻게 처리하는지 설명합니다.
            </p>

            <h2>1. 이미지 처리 방식</h2>
            <p>
                서비스의 핵심 기능인 배경 제거(누끼)는 이용자의 브라우저 내에서 동작하는 클라이언트 사이드 AI
                모델을 통해 수행됩니다. 이용자가 업로드한 이미지는 <strong>외부 서버로 전송되거나 영구적으로
                저장되지 않으며</strong>, 처리 과정에서만 이용자의 기기 메모리에서 사용된 뒤 페이지를 닫으면
                사라집니다.
            </p>

            <h2>2. 수집하는 정보</h2>
            <p>
                서비스는 이용을 위해 회원가입이나 개인 식별 정보 입력을 요구하지 않습니다. 다만 서비스 운영과
                광고 게재를 위해 다음과 같은 정보가 자동으로 수집·이용될 수 있습니다.
            </p>
            <ul>
                <li>접속 기기·브라우저 정보, 운영체제, 화면 해상도 등 표준 로그 정보</li>
                <li>쿠키 및 유사 기술을 통한 광고·분석 관련 식별자</li>
            </ul>

            <h2>3. 쿠키 및 광고 (Google AdSense)</h2>
            <p>
                서비스는 무료 운영을 위해 제3자 광고 제공업체인 <strong>Google AdSense</strong>를 사용합니다.
                Google을 포함한 제3자 공급업체는 쿠키를 사용하여 이용자의 이전 방문 기록을 바탕으로 광고를
                게재할 수 있습니다.
            </p>
            <ul>
                <li>
                    Google은 광고 쿠키를 사용하여 이용자가 본 서비스 및 다른 웹사이트를 방문한 기록에 기반한
                    맞춤형 광고를 제공합니다.
                </li>
                <li>
                    이용자는{' '}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                        Google 광고 설정
                    </a>
                    에서 맞춤 광고를 사용 중지할 수 있습니다.
                </li>
                <li>
                    제3자 공급업체의 쿠키 사용에 대한 자세한 내용과 차단 방법은{' '}
                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                        Google 광고 정책
                    </a>{' '}
                    및{' '}
                    <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                        www.aboutads.info
                    </a>
                    에서 확인할 수 있습니다.
                </li>
            </ul>

            <h2>4. 정보의 이용 목적</h2>
            <p>
                수집된 정보는 서비스 제공·개선, 오류 분석, 광고 게재 및 통계 목적으로만 이용되며, 이용자를 직접
                식별하기 위한 용도로 사용되지 않습니다.
            </p>

            <h2>5. 정보의 제3자 제공</h2>
            <p>
                서비스는 위에 명시된 광고·분석 목적의 제3자(Google) 외에 이용자 정보를 별도로 판매하거나 제공하지
                않습니다.
            </p>

            <h2>6. 이용자의 권리</h2>
            <p>
                이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 단, 쿠키를 차단할 경우
                일부 기능 또는 광고 게재 방식이 달라질 수 있습니다.
            </p>

            <h2>7. 아동의 개인정보</h2>
            <p>
                서비스는 만 14세 미만 아동을 주 대상으로 하지 않으며, 아동의 개인정보를 고의로 수집하지 않습니다.
            </p>

            <h2>8. 방침의 변경</h2>
            <p>
                본 방침은 법령이나 서비스 정책 변경에 따라 수정될 수 있으며, 변경 시 본 페이지를 통해
                공지합니다.
            </p>

            <h2>9. 문의처</h2>
            <p>
                개인정보 처리에 관한 문의는 <a href="mailto:stanlee3927@gmail.com">stanlee3927@gmail.com</a> 으로
                연락해 주세요.
            </p>
        </PageShell>
    );
}
