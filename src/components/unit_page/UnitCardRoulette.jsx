import { useState, useCallback, useEffect } from "react"

import UnitCard from "./UnitCard"

import unitCardMetadata from "../../assets/unit_page/unit_card_metadata.js"

import style from "../../styles/unit_page.module.css"

export default function UnitCardRoulette({unitName}) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [mousePositionX, setMousePositionX] = useState(undefined);
    const [dragging, setDragging] = useState(false);

    const [orderedUnitCardMetadata, setOrderedUnitCardMetadata] = useState({});

    useEffect(()=>{
        // 추후, 웹서버에서 챕터 진행 정보 받아오는 거 구현해야함

    },[]);

    const handleRotationStart = useCallback(e => {
        e.stopPropagation();

        if(e.type=="touchstart") {
            setMousePositionX(e.touches[0].screenX);
            console.log(`Attached: ${e.touches[0].screenX}`);
        } else {
            e.preventDefault();
            setMousePositionX(e.screenX);
            console.log(`Attached: ${e.screenX}`);
        }

        setDragging(true);
    }, []);

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

        let newScrollPosition = scrollPosition + (newMousePositionX - mousePositionX);
        
        setScrollPosition(newScrollPosition);

        setMousePositionX(newMousePositionX);
        console.log(newScrollPosition);
    }, [dragging, scrollPosition, mousePositionX]);

    const handleRotationEnd = useCallback(e => {
        if(!dragging) return;
        
        e.stopPropagation();

        setDragging(false);
    }, [dragging]);

    return (
        <div onTouchStart={handleRotationStart}
            onTouchMove={handleRotation} onTouchEnd={handleRotationEnd}
            onMouseDown={handleRotationStart} onMouseMove={handleRotation}
            onMouseUp={handleRotationEnd} onMouseLeave={handleRotationEnd}
            className={style.unit_card_roulette}
            style={{zIndex: "0", perspective: "500rem", transformStyle: "preserve-3d"}}>
                <UnitCard scrollPosition={scrollPosition} side={0} metadata={unitCardMetadata[unitName]} locked={false} chapterProgress={3}/>
                <UnitCard scrollPosition={scrollPosition} side={1} metadata={unitCardMetadata[unitName]} locked={true} chapterProgress={3}/>
                <UnitCard scrollPosition={scrollPosition} side={2} metadata={unitCardMetadata[unitName]} locked={true} chapterProgress={3}/>
        </div>
    );
}