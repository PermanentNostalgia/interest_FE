import { useNavigate, useParams } from "react-router"

import BottomTab from "../components/common/BottomTab"

import unitCardMetadata from "../assets/unit_page/unit_card_metadata.js"
import { getRecords } from "../utils/records"
import style from "../styles/unit_page.module.css"

export default function UnitDetailPage() {
    const { unitName } = useParams();
    const navigate = useNavigate();

    const unit = unitCardMetadata[unitName];
    const records = getRecords();

    if(!unit || unit.locked || unit.chapters.length==0) {
        return <h1>'{unitName}' 유닛은 아직 열리지 않았어요.</h1>;
    }

    const isLearned = chapter => Boolean(records.terms[chapter.segment]);
    const chapterProgress = unit.chapters.filter(isLearned).length;
    const isFinished = chapterProgress == unit.chapters.length;

    const handleStart = () => {
        const target = unit.chapters.find(chapter => !isLearned(chapter)) ?? unit.chapters[0];
        navigate(`/learn/${target.segment}`);
    };

    let title = "오늘은 뭘 배워볼까요?";
    if(isFinished) title = "복습하러 갈까요?";
    else if(chapterProgress>0) title = "이어서 학습해봐요";

    let buttonLabel = "1분만에 배우기";
    if(isFinished) buttonLabel = "복습하기";
    else if(chapterProgress>0) buttonLabel = "↻ 이어서 학습하기";

    return(
        <div className={style.unit_page}>
            <p className={`${style.unit_page_slogan} ${style.hello1}`}>
                금융 용어 배우기
            </p>
            <p className={`${style.unit_page_slogan} ${style.hello2}`}>
                {title}
            </p>
            {chapterProgress==0 &&
                <p className={`${style.unit_page_slogan} ${style.hello3}`}>
                    시작해봐요
                </p>
            }

            <div className={style.unit_detail_card}
                style={{background: `linear-gradient(180deg, ${unit.outterColor} 0%, ${unit.innerColor} 100%)`}}>
                <p className={style.unit_detail_unit}>{unit.title}</p>
                <h1 className={style.unit_detail_title}>오늘의 용어</h1>

                <ul className={style.unit_detail_chapters}>
                    {unit.chapters.map(chapter => {
                        const learned = isLearned(chapter);
                        const dimmed = chapterProgress>0 && !learned;
                        return(
                            <li key={chapter.segment} className={dimmed ? style.dimmed : ""}>
                                {learned && <span className={style.unit_detail_check}>{"✓"}</span>}
                                {chapter.name}
                            </li>
                        );
                    })}
                </ul>

                <p className={style.unit_detail_progress}>
                    용어 학습 {chapterProgress}/{unit.chapters.length}
                </p>
                <div className={style.unit_detail_bar}>
                    <div style={{width: `${100/unit.chapters.length*chapterProgress}%`}}></div>
                </div>
                <button className={style.unit_card_button} onClick={handleStart}>
                    {buttonLabel}
                </button>
            </div>

            <BottomTab />
        </div>
    );
}
