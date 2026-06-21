import React from 'react';
import teja from '../assets/teja.jpg';
import Karthik from '../assets/karthik.png';
function Creators(){
    return(
        <>
        <div className="creators1">
            <div className='divide'>
            <div className='inner'>
                <img className='imgg' src={teja} alt="teja" />
                <div className='divvv'>
                <h1>Teja is the Co-Founder and Lead Developer at Rise IQ, passionate about building innovative technology solutions that solve real-world problems. With a strong foundation in software development, web technologies, and AI-driven applications, he focuses on transforming ideas into scalable digital products.</h1>
               <p>Co-Founder and Lead Developer</p>
                </div>
            </div>
            <div className='inner'>
                <img className='imgg' src={Karthik} alt="teja" />
                <div className='divvv'>
                <h1>Karthik is a Developer and Graphic Designer at Rise IQ, combining technical expertise with creative design to build engaging digital experiences. With a passion for both coding and visual storytelling, he plays a key role in transforming ideas into functional and visually appealing products.</h1>
               <p>Founder and Developer</p>
                </div>
            </div>
            </div>
        </div>
        </>
    )
}
export default Creators;