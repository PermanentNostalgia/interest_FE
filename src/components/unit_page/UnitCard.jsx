import { useNavigate } from "react-router"

import style from "../../styles/unit_page.module.css"

export default function UnitCard({scrollPosition, side, rotationSpeed, rotationRatio, metadata, chapterProgress, isFront}) {
    const navigate = useNavigate();

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
    <div className={`${style.unit_card} ${metadata["locked"] ? style.locked : style.unlocked} ${isFront ? style.front : ""}`} style={
        {animationName: `${style.unit_card_rotation}`,
        animationDuration: `${rotationSpeed}s`,
        animationDelay: rotationStartingPosition,
        animationDirection: rotationDirection,
        animationIterationCount: "infinite",
        animationTimingFunction: "linear",
        animationPlayState: "paused",
        background: `radial-gradient(50% 50% at 50% 50%, ${metadata.innerColor} 0%, ${metadata.outterColor} 100%)`
        }}>
        <h1 className={style.unit_card_title}>{metadata.title}</h1>
        {   (metadata["locked"]) ?
            <div className={style.unit_card_button}>잠겨있어요</div>
            : <button className={style.unit_card_button} onClick={handleStart}>
                배우러 가기
            </button>
        }
    </div>);
}