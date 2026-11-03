import { useState, useCallback } from "react"

import UnitCard from "./UnitCard"

import style from "../../styles/unit_page.module.css"

export default function UnitCardRoulette({unitCardMetadata}) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [currentUnitCardMetadata, setCurrentUnitCardMetadata] = useState(unitCardMetadata);
    const [mousePositionX, setMousePositionX] = useState(undefined);
    const [dragging, setDragging] = useState(false);
    const [isUnitCardReturning, setIsUnitCardReturning] = useState(false);

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

    return (
        <div onTouchStart={handleRotationStart}
            onTouchMove={handleRotation} onTouchEnd={handleRotationEnd}
            onMouseDown={handleRotationStart} onMouseMove={handleRotation}
            onMouseUp={handleRotationEnd} className={style.unit_card_roulette}
            style={{overflow: "hidden"}}>
                <UnitCard className={style.unit_card} scrollPosition={scrollPosition} metadata={unitCardMetadata} locked={false} chapterProgress={5}/>
        </div>
    );
}