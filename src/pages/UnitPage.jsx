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
            <p className={`${style.unit_page_slogan} ${style.hello1}`}>
                안녕하세요, Test1님!
            </p>
            <p className={`${style.unit_page_slogan} ${style.hello2}`}>
                오늘은 뭘 배워볼까요?
            </p>
            <p className={`${style.unit_page_slogan} ${style.hello3}`}>
                금융 용어 외우기
            </p>
            <UnitCardRoulette unitCardMetadata={currentUnitCardMetadata}/>
        </div>
    );
}