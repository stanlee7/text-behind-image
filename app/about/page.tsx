import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
    title: '소개 - 누끼 텍스트',
    description: '누끼 텍스트는 AI가 인물·피사체를 자동으로 인식해 텍스트를 뒤에 배치해 주는 무료 썸네일 디자인 도구입니다. 서비스의 목적과 만든 사람을 소개합니다.',
    alternates: { canonical: '/about' },
};

export default function AboutPage() {
    return (
        <PageShell
            title="누끼 텍스트 소개"
            description="복잡한 포토샵 없이, AI로 '인물 뒤 텍스트' 디자인을 1초 만에 완성하는 무료 도구입니다."
        >
            <p>
                <strong>누끼 텍스트(Nukki Text)</strong>는 사진 속 인물이나 피사체를 자동으로 인식해, 그 뒤로 텍스트를
                자연스럽게 배치해 주는 웹 기반 이미지 편집 도구입니다. 유튜브 썸네일, 인스타그램 피드, 블로그
                대표 이미지, 포스터 등에서 자주 쓰이는 &lsquo;텍스트 비하인드(text-behind-subject)&rsquo; 효과를
                전문 프로그램 없이 브라우저에서 바로 만들 수 있습니다.
            </p>

            <h2>왜 만들었나요?</h2>
            <p>
                기존에 이 효과를 내려면 포토샵에서 피사체를 일일이 누끼(배경 분리)한 뒤, 텍스트 레이어를 그 사이에
                끼워 넣는 번거로운 과정을 거쳐야 했습니다. 디자인에 익숙하지 않은 크리에이터에게는 진입 장벽이
                높았죠. 누끼 텍스트는 이 과정을 <strong>업로드 → 자동 누끼 → 텍스트 입력 → 다운로드</strong>의 네
                단계로 단순화해, 누구나 몇 초 만에 결과물을 얻을 수 있도록 만들었습니다.
            </p>

            <h2>어떻게 동작하나요?</h2>
            <p>
                업로드된 이미지는 브라우저 안에서 동작하는 온디바이스 AI 모델(머신러닝 기반 배경 제거)을 통해
                분석됩니다. 즉 이미지가 외부 서버로 전송·저장되지 않고 <strong>사용자의 기기 안에서</strong>
                처리됩니다. 분리된 피사체 레이어와 배경 레이어 사이에 입력한 텍스트를 끼워 넣어, 마치 인물 뒤에
                글자가 있는 듯한 입체적인 화면을 만들어 냅니다.
            </p>

            <h2>주요 특징</h2>
            <ul>
                <li><strong>완전 무료 &amp; 무제한</strong> — 회원가입이나 구독료 없이 원하는 만큼 사용할 수 있습니다.</li>
                <li><strong>자동 누끼</strong> — AI가 피사체를 인식해 수작업 없이 배경을 분리합니다.</li>
                <li><strong>다양한 한글·영문 폰트</strong> — 썸네일에 어울리는 굵은 디스플레이 폰트를 제공합니다.</li>
                <li><strong>고화질 PNG 다운로드</strong> — 원본 해상도 그대로 내보낼 수 있습니다.</li>
                <li><strong>개인정보 보호</strong> — 이미지는 기기 안에서 처리되며 서버에 별도 저장되지 않습니다.</li>
            </ul>

            <h2>만든 사람</h2>
            <p>
                누끼 텍스트는 콘텐츠 크리에이터이자 개발자인 <strong>Stanlee Tam</strong>이 1인 개발로 운영하는
                무료 프로젝트입니다. 더 편리한 콘텐츠 제작 도구를 만드는 것을 목표로 하고 있습니다. 서비스에 대한
                제안이나 문의는 <a href="mailto:stanlee3927@gmail.com">stanlee3927@gmail.com</a> 으로 보내주세요.
            </p>
        </PageShell>
    );
}
