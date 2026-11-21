import { useState, useCallback, useEffect } from "react"

import UnitCard from "./UnitCard"

import unitCardMetadata from "../../assets/unit_page/unit_card_metadata.js"

import style from "../../styles/unit_page.module.css"

export default function UnitCardRoulette({unitName, rotationSpeed=3}) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [mousePositionX, setMousePositionX] = useState(undefined);
    const [dragging, setDragging] = useState(false);

    const [orderedUnitCardMetadata, setOrderedUnitCardMetadata] = useState([]);

    useEffect(()=>{
        const newMetadata = [];
        newMetadata[0] = unitCardMetadata[unitName] ?? unitCardMetadata["unit1"];
        newMetadata[2] = unitCardMetadata[newMetadata[0].nextUnit];
        newMetadata[1] = unitCardMetadata[newMetadata[0].previousUnit];
        console.log(newMetadata);

        setOrderedUnitCardMetadata(newMetadata);
    },[]);

    const handleRotationStart = useCallback(e => {
        e.stopPropagation();

        if(e.type=="touchstart") {
            setMousePositionX(e.touches[0].screenX);
        } else {
            e.preventDefault();
            setMousePositionX(e.screenX);
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
        console.log(newScrollPosition);

        setMousePositionX(newMousePositionX);
    }, [dragging, scrollPosition, mousePositionX]);

    const handleRotationEnd = useCallback(e => {
        if(!dragging) return;
        
        e.stopPropagation();

        setDragging(false);
    }, [dragging]);

    let unitCards = [];
    if(orderedUnitCardMetadata.length!=0) {
        unitCards = orderedUnitCardMetadata.map((metadata, index)=>{
            return(
                <UnitCard key={index} scrollPosition={scrollPosition} rotationSpeed={rotationSpeed} side={index} metadata={metadata ?? unitCardMetadata["unit1"]} chapterProgress={3}/>
            );
        })
    }

    return (
        <div onTouchStart={handleRotationStart}
            onTouchMove={handleRotation} onTouchEnd={handleRotationEnd}
            onMouseDown={handleRotationStart} onMouseMove={handleRotation}
            onMouseUp={handleRotationEnd} onMouseLeave={handleRotationEnd}
            className={style.unit_card_roulette}
            style={{zIndex: "0", perspective: "500rem", transformStyle: "preserve-3d"}}>
            {unitCards}
        </div>
    );
}