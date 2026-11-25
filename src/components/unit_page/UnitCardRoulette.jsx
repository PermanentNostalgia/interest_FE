import { useState, useCallback, useEffect, useRef } from "react"

import UnitCard from "./UnitCard"

import unitCardMetadata from "../../assets/unit_page/unit_card_metadata.js"
import { getSessionToken } from "../../utils/auth.js"

import style from "../../styles/unit_page.module.css"

export default function UnitCardRoulette({unitName, rotationSpeed=6, rotationRatio=0.01}) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [mousePositionX, setMousePositionX] = useState(undefined);
    const [dragging, setDragging] = useState(false);

    const [orderedUnitCardMetadata, setOrderedUnitCardMetadata] = useState([]);

    const animationTimer = useRef();

    useEffect(()=>{
        fetch("http://165.101.61.221:45240/api/users/me", {
            method: "GET",
            header: {"Authorization": `Bearer ${getSessionToken()}`}
        }).then((response)=>{
            console.log(response.json())
        }).catch((error)=>{
            console.log(error.json());
        });
        const newMetadata = [];
        newMetadata[0] = unitCardMetadata[unitName] ?? unitCardMetadata["unit1"];
        newMetadata[2] = unitCardMetadata[newMetadata[0].nextUnit];
        newMetadata[1] = unitCardMetadata[newMetadata[0].previousUnit];
        console.log(newMetadata);

        setOrderedUnitCardMetadata(newMetadata);
    },[]);

    const animateCardReturning = useCallback(() => {
        let scrollDeparture = scrollPosition;
        let scrollDestination = Math.floor((Math.abs(scrollPosition) + rotationSpeed/rotationRatio/6) / (rotationSpeed/rotationRatio/3))*rotationSpeed/rotationRatio/3;
        if(scrollPosition<0) scrollDestination = -scrollDestination;

        let scrollPositionDelta = (scrollDestination-scrollDeparture)/10;
        let scrollPositionTemp = scrollDeparture;
        animationTimer.current = setInterval(()=>{
            let newScrollPosition = scrollPositionTemp + scrollPositionDelta;
            if((scrollPositionDelta<0) ? (newScrollPosition<scrollDestination) : (newScrollPosition>scrollDestination)) {
                setScrollPosition(scrollDestination);
                clearInterval(animationTimer.current);
                animationTimer.current = null;
            } else {
                setScrollPosition(newScrollPosition);
                scrollPositionTemp = newScrollPosition;
            }
        }, 10);
    },[scrollPosition]);

    const handleRotationStart = useCallback(e => {
        if(animationTimer) {
            clearInterval(animationTimer.current);
        }

        e.stopPropagation();

        if(e.type=="touchstart") {
            setMousePositionX(e.touches[0].screenX);
        } else {
            e.preventDefault();
            setMousePositionX(e.screenX);
        }

        setDragging(true);
    }, [animationTimer.current]);

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
        animateCardReturning();
    }, [dragging, animateCardReturning]);

    const stepSize = rotationSpeed/rotationRatio/3;
    const frontSide = ((Math.round(scrollPosition/stepSize) % 3) + 3) % 3;
    const unitKeys = Object.keys(unitCardMetadata);
    const frontKey = unitKeys.find(key => unitCardMetadata[key] === orderedUnitCardMetadata[frontSide]);

    let unitCards = [];
    if(orderedUnitCardMetadata.length!=0) {
        unitCards = orderedUnitCardMetadata.map((metadata, index)=>{
            return(
                <UnitCard key={index} scrollPosition={scrollPosition} rotationSpeed={rotationSpeed} rotationRatio={rotationRatio} side={index} metadata={metadata ?? unitCardMetadata["unit1"]} isFront={index===frontSide}/>
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
            <div className={style.unit_dots}>
                {unitKeys.map(key => <span key={key} className={key === frontKey ? style.active : ""}></span>)}
            </div>
        </div>
    );
}