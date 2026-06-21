import React from "react";

function Secondpage(){
    const scrollText = "Verified Skills \u2022 Doubt-to-Mentor \u2022 Project Matching \u2022 Placement Intel \u2022 Skill Score \u2022 Peer-Verified \u2022 Campus OS \u2022 Co-founder Match \u2022";

    return(
        <>
        <div className="secmain">
            <div className="secc" aria-label="skills marquee">
              <div className="marquee-track">
                <h1>{scrollText}</h1>
                <h1 aria-hidden="true">{scrollText}</h1>
              </div>
            </div>
        </div>
        </>
    )
}

export default Secondpage;
