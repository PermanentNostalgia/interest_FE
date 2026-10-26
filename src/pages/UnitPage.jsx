import { Link, useParams } from "react-router"
import { createRoot } from "react-dom/client"

import unitPageMetadata from "../assets/unit_page/unit_page_metadata.js"

export default function UnitPage() {
    const { unitName } = useParams();
    const currentUnitPageMetadata = unitPageMetadata[unitName];

    if(!currentUnitPageMetadata) {
        return(<h1>'{unitName}'라는 이름의 유닛은 존재하지 않습니다.</h1>)
    }

    return(
        <>
            <h1>{unitName}</h1>
            <h2>{currentUnitPageMetadata.description}</h2>
            {
                (!currentUnitPageMetadata.previousUnit) ? 
                (<></>) : 
                (<Link to={"/units/"+currentUnitPageMetadata.previousUnit}>{currentUnitPageMetadata.previousUnit}</Link>)
            }
            <br/>
            {
                (!currentUnitPageMetadata.nextUnit) ? 
                (<></>) : 
                (<Link to={"/units/"+currentUnitPageMetadata.nextUnit}>{currentUnitPageMetadata.nextUnit}</Link>)
            }
            <br/><br/>
            { currentUnitPageMetadata.chapters.map(
                    (chapterMetadata, index) => (<div key={index}>
                        <Link to={"/learn/"+chapterMetadata.segment}>{chapterMetadata.name}</Link>
                        </div>)
                )}
        </>
    );
}