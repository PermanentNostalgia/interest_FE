import { Link, useParams } from "react-router"
import { createRoot } from "react-dom/client"
import { useState, useEffect } from "react"

import UnitCardRoulette from "../components/unit_page/UnitCardRoulette"
import unitCardMetadata from "../assets/unit_page/unit_card_metadata.js"

import style from "../styles/unit_page.module.css"

export default function UnitPage() {
    const { unitName } = useParams();
    const currentUnitCardMetadata = unitCardMetadata[unitName];

    if(!currentUnitCardMetadata) {
        return(<h1>'{unitName}'라는 이름의 유닛은 존재하지 않습니다.</h1>)
    }

    return(
        <div className={style.unit_page}>
            <UnitCardRoulette unitCardMetadata={currentUnitCardMetadata}/>
        </div>
    );
}