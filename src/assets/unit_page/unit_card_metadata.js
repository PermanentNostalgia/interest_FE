const unitPageMetadata = {
    unit1: {
        previousUnit: "unit3",
        nextUnit: "unit2",
        title: "UNIT 1",
        innerColor: "#E8700A",
        outterColor: "#E8DC6E",
        locked: false,
        chapters: [
            {name: "금리", segment: "interest"},
            {name: "시가총액", segment: "market-cap"},
            {name: "PER", segment: "per"},
            {name: "PBR", segment: "pbr"},
            {name: "ROE", segment: "roe"}
        ]
    },
    unit2: {
        previousUnit: "unit1",
        nextUnit: "unit3",
        title: "UNIT 2",
        innerColor: "#A8C840",
        outterColor: "#F08080",
        locked: false,
        chapters: [
            {name: "EPS", segment: "eps"},
            {name: "영업이익", segment: "operating-profit"},
            {name: "채권", segment: "bond"},
            {name: "부채비율", segment: "debt-ratio"},
            {name: "매출액", segment: "revenue"}
        ]
    },
    unit3: {
        previousUnit: "unit2",
        nextUnit: "unit1",
        title: "UNIT 3",
        innerColor: "#1F6B1F",
        outterColor: "#7BC000",
        locked: true,
        chapters: [
            
        ]
    }
};

export default unitPageMetadata;