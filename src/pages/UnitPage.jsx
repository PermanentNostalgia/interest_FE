import { Link, useParams } from "react-router"
import { createRoot } from "react-dom/client"
import { useState, useEffect } from "react"

import UnitCardRoulette from "../components/unit_page/UnitCardRoulette"
import BottomTab from "../components/common/BottomTab"

import unitCardMetadata from "../assets/unit_page/unit_card_metadata.js"
import style from "../styles/unit_page.module.css"

export default function UnitPage() {
    const { unitName } = useParams();

    return(
        <div className={style.unit_page}>
            <p className={`${style.unit_page_slogan} ${style.hello1}`}>
                금융 용어 배우기
            </p>
            <p className={`${style.unit_page_slogan} ${style.hello2}`}>
                오늘은 뭘 배워볼까요?
            </p>
            <p className={`${style.unit_page_slogan} ${style.hello3}`}>
                시작해봐요
            </p>
            <UnitCardRoulette unitName={unitName} rotationSpeed={6}/>
            <BottomTab />
        </div>
    );
}