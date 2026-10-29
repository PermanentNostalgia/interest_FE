import { useState } from "react"

import style from "../../styles/unit_page.module.css"

export default function UnitCardRoulette({unitCardMetadata}) {
    const [angle, setAngle] = useState(0);
    const [mousePositionX, setMousePositionX] = useState(undefined);
    const [dragging, setDragging] = useState(false);

    function onRotationStart(e) {
        e.stopPropagation();

        if(e.type=="touchstart") {
            setMousePositionX(e.touches[0].screenX);
        } else {
            e.preventDefault();
            setMousePositionX(e.screenX);
        }

        setDragging(true);
    }

    function onRotation(e) {
        if(!dragging) return;

        e.stopPropagation();
        let newMousePositionX;
        if(e.type=="touchmove") {
            newMousePositionX = e.touches[0].screenX;
        } else {
            e.preventDefault();
            newMousePositionX = e.screenX;
        }

        const deltaMousePositionX = newMousePositionX - mousePositionX;
        setAngle(angle + Math.PI/180 * deltaMousePositionX * 0.1);
        setMousePositionX(newMousePositionX);

        console.log(angle);
    }

    function onRotationEnd(e) {
        if(!dragging) return;
        
        e.stopPropagation();

        setDragging(false);
        console.log("stop dragging");
    }

    return (
        <div className={style.unit_card_roulette} onMouseDown={onRotationStart} onMouseMove={onRotation} onMouseUp={onRotationEnd} onMouseLeave={onRotationEnd}
        onTouchStart={onRotationStart} onTouchMove={onRotation} onTouchEnd={onRotationEnd}>
            <div></div>
            <div></div>
            <div className={style.unit_card} style={{
                transformOrigin: "center bottom",
                transform: `rotate(${angle}rad)`
            }}></div>
        </div>
    );
}