import { useState, useCallback, useEffect } from "react"

import UnitCard from "./UnitCard"

import unitCardMetadata from "../../assets/unit_page/unit_card_metadata.js"

import style from "../../styles/unit_page.module.css"

export default function UnitCardRoulette({unitName}) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [mousePositionX, setMousePositionX] = useState(undefined);
    const [dragging, setDragging] = useState(false);
    const [isUnitCardReturning, setIsUnitCardReturning] = useState(false);

    const [orderedUnitCardMetadata, setOrderedUnitCardMetadata] = useState({});

    useEffect(()=>{
        // 추후, 웹서버에서 챕터 진행 정보 받아오는 거 구현해야함
        let middleMetadata = unitCardMetadata[unitName] ?? unitCardMetadata["unit1"];
        let leftMetadata = [], rightMetadata = [];
        let leftUnitCardName = middleMetadata.previousUnit;
        let rightUnitCardName = middleMetadata.nextUnit;
        while(leftUnitCardName || rightUnitCardName) {
            if(leftUnitCardName) {
                leftMetadata.push(unitCardMetadata[leftUnitCardName]);
                leftUnitCardName = unitCardMetadata[leftUnitCardName].previousUnit;
            }

            if(rightUnitCardName) {
                rightMetadata.push(unitCardMetadata[rightUnitCardName]);
                rightUnitCardName = unitCardMetadata[rightUnitCardName].nextUnit;
            }
        }

        setOrderedUnitCardMetadata({middle: middleMetadata, left: leftMetadata, right: rightMetadata});
    },[]);

    const handleRotationStart = useCallback(e => {
        if(isUnitCardReturning) return;

        e.stopPropagation();

        if(e.type=="touchstart") {
            setMousePositionX(e.touches[0].screenX);
        } else {
            e.preventDefault();
            setMousePositionX(e.screenX);
        }

        setDragging(true);
    }, [isUnitCardReturning]);

    const handleRotation = useCallback(e => {
        if(!dragging) return;

        e.stopPropagation();
        let newMousePositionX;
        if(e.type=="touchmove") {
            newMousePositionX = e.touches[0].screenX;
        } else {
            e.preventDefault();
            newMousePositionX = e.screenX;
        }

        setScrollPosition(scrollPosition + (newMousePositionX -mousePositionX));
        setMousePositionX(newMousePositionX);
    }, [dragging, scrollPosition, mousePositionX]);

    const handleRotationEnd = useCallback(e => {
        if(!dragging) return;
        
        e.stopPropagation();

        setDragging(false);
    }, [dragging]);

    let unitCards = [];
    if(orderedUnitCardMetadata["middle"]) {
        let leftUnitCards = orderedUnitCardMetadata["left"].map((metadata, index)=>{
            return (
                <UnitCard scrollPosition={scrollPosition-280*(index+1)}
                metadata={metadata} chapterProgress={0} locked={metadata.locked}
                key={metadata.title}/>
            );
        });
        let rightUnitCards = orderedUnitCardMetadata["right"].map((metadata, index)=>{
            return (
                <UnitCard scrollPosition={scrollPosition+280*(index+1)}
                metadata={metadata} chapterProgress={0} locked={metadata.locked}
                key={metadata.title}/>
            );
        });
        unitCards = [...leftUnitCards, ...rightUnitCards, 
            <UnitCard scrollPosition={scrollPosition}
            metadata={orderedUnitCardMetadata["middle"]}
            chapterProgress={0} locked={orderedUnitCardMetadata["middle"].locked}
            key={orderedUnitCardMetadata["middle"].title}/>
        ];
    }

    return (
        <div onTouchStart={handleRotationStart}
            onTouchMove={handleRotation} onTouchEnd={handleRotationEnd}
            onMouseDown={handleRotationStart} onMouseMove={handleRotation}
            onMouseUp={handleRotationEnd} className={style.unit_card_roulette}
            style={{overflow: "hidden"}}>
                {unitCards}
        </div>
    );
}