import './loaderBox.scss';

import { useState } from 'react';

export default function LoaderBox(props) {

    const [loaded, setLoaded] = useState(false);

    if(document.readyState === "complete"){
        setTimeout(()=>{
            setLoaded(true);
        }, 800)
    }

    if(props.mode == undefined){
        return (
            <></>
        );
    }

    if(props.mode == "hide"){
        return (
            <>
                {loaded ? <></> : <div className={document.readyState === "complete" ? "laderBox__pageLoader_hide" : "laderBox__pageLoader"}></div>}
            </>
        );
    }

    if(props.mode == "show"){
        return (
            <>
                <div className="laderBox__pageLoader_show"></div>
            </>
        );
    }
}