import { useNavigate } from "react-router"

import unitCardMetadata from "../../assets/unit_page/unit_card_metadata.js"
import { isUnitLocked } from "../../utils/units"
import style from "../../styles/unit_page.module.css"

export default function UnitCard({scrollPosition, side, rotationSpeed, rotationRatio, metadata, isFront}) {
    const navigate = useNavigate();
    const locked = isUnitLocked(metadata);

    const handleStart = () => {
        const unitKey = Object.keys(unitCardMetadata).find(key => unitCardMetadata[key] === metadata);
        navigate(`/units/${unitKey}/terms`);
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
    <div className={`${style.unit_card} ${locked ? style.locked : style.unlocked} ${isFront ? style.front : ""}`} style={
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
        {   locked ?
            <div className={style.unit_card_button}>{metadata.lockHint ?? "잠겨있어요"}</div>
            : <button className={style.unit_card_button} onClick={handleStart}>
                배우러 가기
            </button>
        }
    </div>);
}