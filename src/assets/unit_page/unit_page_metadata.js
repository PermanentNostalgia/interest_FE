const unitPageMetadata = {
    unit1: {
        previousUnit: null,
        nextUnit: "unit2",
        description: "주식 기초",
        chapters: [
            {name: "거시경제 기본 용어", segment: "interest"},
            {name: "주식이란?", segment: "share_basic"},
            {name: "배당", segement: "dividend"},
            {name: "재무제표", segment: "financial_statements"},
        ]
    },
    unit2: {
        previousUnit: "unit1",
        nextUnit: "unit3",
        description: "채권",
        chapters: [
            {name: "채권이란?", segment: "bond"},
            {name: "표면 금리와 만기수익률", segment: "coupon_and_yield"},
            {name: "듀레이션", segment: "duration"}
        ]
    },
    unit3: {
        previousUnit: "unit2",
        nextUnit: null,
        description: "파생상품",
        chapters: [
            {name: "선물", segment: "future"},
            {name: "옵션", segment: "option"},
            {name: "FX마진", segment: "fx"},
        ]
    }
};

export default unitPageMetadata;