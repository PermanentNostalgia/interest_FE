import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

import style from "../../styles/unit_page.module.css"

export default function UnitCard({scrollPosition, side, rotationSpeed, rotationRatio, metadata, chapterProgress}) {
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    
    useEffect(()=>{
        if(!metadata["locked"]) {
            let chaptersList = metadata.chapters.map((chapter, index) => (
                <p key={chapter.segment} className={`${style.chapter_title} ${(index<chapterProgress) ? style.highlight : ""}`}
                style={{
                    top: `${105+index*28}rem`
                }}>{chapter.name}</p> 
            ));
            setChapters(chaptersList);
        }
    },[]);

    const handleStart = () => {
        const targetIndex =
            chapterProgress >= metadata.chapters.length ? 0 : chapterProgress;
        navigate(`/learn/${metadata.chapters[targetIndex].segment}`);
    };

    let rotationStartingPosition, rotationDirection;

    if(scrollPosition>0) {
        rotationDirection = "reverse";
        rotationStartingPosition = `${-rotationSpeed*(3-side)/3 - Math.abs(scrollPosition)*rotationRatio}s`;
    } else {
        rotationDirection = "normal";
        rotationStartingPosition = `${-rotationSpeed*side/3 - Math.abs(scrollPosition)*rotationRatio}s`;
    }

    return (
    <div className={`${style.unit_card} ${metadata["locked"] ? style.locked : style.unlocked}`} style={
        {animationName: `${style.unit_card_rotation}`,
        animationDuration: `${rotationSpeed}s`,
        animationDelay: rotationStartingPosition,
        animationDirection: rotationDirection,
        animationIterationCount: "infinite",
        animationTimingFunction: "linear",
        animationPlayState: "paused",
        background: `radial-gradient(50% 50% at 50% 50%, ${metadata.innerColor} 0%, ${metadata.outterColor} 100%)`
        }}>
        {   (metadata["locked"]) ?
            (<><h1 className={`${style.unit_card_title} ${style.locked}`}>{metadata.title}</h1>
            <div className={style.unit_card_button}>이전 유닛을 완료하면 열려요</div>
            </>)
            : (<><h1 className={`${style.unit_card_title} ${style.unlocked}`}>{metadata.title}</h1>
            <div className={style.unit_card_subtitle}>오늘의 용어</div>
            {chapters}
            <p className={style.chapter_progress_indicator}>용어 학습 {chapterProgress}/{metadata.chapters.length}</p>
            <div className={style.chapter_progress_bar_background}>
                <div className={style.chapter_progress_bar} style={{
                    width: `${100/metadata.chapters.length*chapterProgress}%`
                }}></div>
            </div>
            <button className={style.unit_card_button} onClick={handleStart}>
                {(chapterProgress==0) ? "1분만에 배우기" : (chapterProgress==metadata.chapters.length) ? "복습하기" : "\u2B6E 이어서 학습하기"}
            </button>
            </>)
        }
    </div>);
}