import React from "react";
import Creators from "./Creators";
function Creatorcomp(){
    return(
        <>
        <div className="creatormain">
            <div className="innd">
            <div className="textt">
                <h1>Our Versatile <span className="dd">Developers</span></h1>
                <p>With honour and passion</p>
            </div>
            <div>
                <Creators/>
            </div>
            </div>
        </div>
        </>
    )
}

export default Creatorcomp;