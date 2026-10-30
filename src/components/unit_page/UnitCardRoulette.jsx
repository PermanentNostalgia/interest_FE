import { useState, useEffect } from "react"

import style from "../../styles/unit_page.module.css"

export default function UnitCardRoulette({unitCardMetadata}) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [currentUnitCard, setCurrentUnitCard] = useState(unitCardMetadata.title);
    const [mousePositionX, setMousePositionX] = useState(undefined);
    const [dragging, setDragging] = useState(false);
    const [isUnitCardReturning, setIsUnitCardReturning] = useState(false);

    function handleRotationStart(e) {
        if(isUnitCardReturning) return;

        e.stopPropagation();

        if(e.type=="touchstart") {
            setMousePositionX(e.touches[0].screenX);
        } else {
            e.preventDefault();
            setMousePositionX(e.screenX);
        }

        setDragging(true);
    }

    function handleRotation(e) {
        if(!dragging) return;

        e.stopPropagation();
        let newMousePositionX;
        if(e.type=="touchmove") {
            newMousePositionX = e.touches[0].screenX;
        } else {
            e.preventDefault();
            newMousePositionX = e.screenX;
        }

        setScrollPosition(scrollPosition + (newMousePositionX -mousePositionX)*3);
        setMousePositionX(newMousePositionX);
    }

    function handleRotationEnd(e) {
        if(!dragging) return;
        
        e.stopPropagation();

        setDragging(false);
    }

    return (
        <div onTouchStart={handleRotationStart}
            onTouchMove={handleRotation} onTouchEnd={handleRotationEnd}
            onMouseDown={handleRotationStart} onMouseMove={handleRotation}
            onMouseUp={handleRotationEnd} className={style.unit_card_roulette}
            style={{overflow: "hidden"}}>
            <div className={`${style.unit_card} ${style.left}`}
            style={{
                transform: `translate(${scrollPosition}px, 0px)`
            }}></div>
            <div className={`${style.unit_card} ${style.right}`}
            style={{
                transform: `translate(${scrollPosition}px, 0px)`
            }}></div>
            <div className={style.unit_card} style={{
                
                transform: `translate(${scrollPosition}px, 0px)`
            }}></div>
        </div>
    );
}