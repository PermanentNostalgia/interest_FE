const unitPageMetadata = {
    unit1: {
        previousUnit: "unit5",
        nextUnit: "unit2",
        title: "Unit 1",
        chapters: [
            {name: "금리", segment: "interest"},
            {name: "채권", segment: "bond"},
            {name: "주식", segment: "share"},
            {name: "배당", segment: "divided"},
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
        nextUnit: "unit1",
        description: "파생상품",
        chapters: [
            {name: "선물", segment: "future"},
            {name: "옵션", segment: "option"},
            {name: "FX마진", segment: "fx"},
        ]
    },
    unit4: {
        previousUnit: "unit3",
        nextUnit: "unit5",
        description: "555555",
        chapters: [
            {name: "선물", segment: "future"},
            {name: "옵션", segment: "option"},
            {name: "FX마진", segment: "fx"},
        ]
    },
    unit5: {
        previousUnit: "unit4",
        nextUnit: "unit1",
        description: "파생33221상품",
        chapters: [
            {name: "선물", segment: "future"},
            {name: "옵션", segment: "option"},
            {name: "FX마진", segment: "fx"},
        ]
    }
};

export default unitPageMetadata;