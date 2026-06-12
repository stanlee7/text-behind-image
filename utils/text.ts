export interface TextLayer {
    id: string;
    content: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: number;
    color: string;
    fontFamily: string;
    isBehind: boolean;
    opacity: number; // 0–100
    rotation: number; // -180–180 (deg)
    letterSpacing: number; // px
    strokeWidth: number;
    strokeColor: string;
    shadowBlur: number;
    shadowColor: string;
}

export interface FontOption {
    label: string;
    value: string;
}

export const FONT_OPTIONS: FontOption[] = [
    { label: '기본 고딕', value: 'sans-serif' },
    { label: '노토 산스', value: 'var(--font-noto-sans-kr)' },
    { label: '블랙한스', value: 'var(--font-black-han-sans)' },
    { label: '도현체', value: 'var(--font-do-hyeon)' },
    { label: '주아체', value: 'var(--font-jua)' },
    { label: '나눔 손글씨', value: 'var(--font-nanum-pen)' },
    { label: 'Inter', value: 'var(--font-inter)' },
    { label: 'Anton', value: 'var(--font-anton)' },
    { label: 'Pacifico', value: 'var(--font-pacifico)' },
    { label: 'Playfair', value: 'var(--font-playfair)' },
];

const genId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

export function createTextLayer(
    x: number,
    y: number,
    fontSize: number,
    content: string = 'TEXT BEHIND'
): TextLayer {
    return {
        id: genId(),
        content,
        x,
        y,
        fontSize,
        fontWeight: 800,
        color: '#ffffff',
        fontFamily: 'var(--font-black-han-sans)',
        isBehind: true,
        opacity: 100,
        rotation: 0,
        letterSpacing: 0,
        strokeWidth: 0,
        strokeColor: '#000000',
        shadowBlur: 0,
        shadowColor: '#000000',
    };
}
