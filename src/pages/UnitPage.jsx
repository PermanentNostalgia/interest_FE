import { Link, useParams } from "react-router"
import { createRoot } from "react-dom/client"
import { useState } from "react"

import unitPageMetadata from "../assets/unit_page/unit_page_metadata.js"

import style from "../styles/unit_page.module.css"

export default function UnitPage() {
    const { unitName } = useParams();
    const [angle, setAngle] = useState(0);
    const [mousePositionX, setMousePositionX] = useState(null);
    const [mouseDowned, setMouseDowned] = useState(false);
    const currentUnitPageMetadata = unitPageMetadata[unitName];

    if(!currentUnitPageMetadata) {
        return(<h1>'{unitName}'라는 이름의 유닛은 존재하지 않습니다.</h1>)
    }

    function onMouseDown(e) {
        e.stopPropagation();
        e.preventDefault();
        
        setMousePositionX(e.screenX);
        setMouseDowned(true);
    }

    function onMouseMove(e) {
        e.stopPropagation();
        e.preventDefault();
        if(!mouseDowned) return;

        const deltaMousePositionX = e.screenX - mousePositionX;

        setAngle(angle+Math.PI/180*deltaMousePositionX*0.8);

        setMousePositionX(e.screenX);
    }

    function onMouseUp(e) {
        e.stopPropagation();
        e.preventDefault();

        setMousePositionX(null);
        setMouseDowned(false);
    }

    return(
        <div>
        <div className={style.unit_card}
                style={
                    {transformOrigin: "center 200%",
                    transform: `rotate(${angle + Math.PI/12}rad)`
                    }
                }>
                </div>
            <div className={style.unit_card}
                style={
                    {transformOrigin: "center 200%",
                    transform: `rotate(${angle - Math.PI/12}rad)`
                    }
                }>
                </div>
            <div className={style.unit_card} onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                style={
                    {transformOrigin: "center 200%",
                    transform: `rotate(${angle}rad)`
                    }
                }>
                </div>
        </div>
    );
}