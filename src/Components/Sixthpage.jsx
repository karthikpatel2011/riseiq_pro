import React, { useRef, useEffect, useState, useCallback } from "react";
import learning from "../assets/learning.png"
import phase2 from "../assets/phase2.png"
import phase3 from "../assets/phase3.png"

function Sixthpage() {
    const sectionRef = useRef(null);
    const img1Ref = useRef(null);
    const img2Ref = useRef(null);
    const img3Ref = useRef(null);
    const pathRef = useRef(null);
    const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });
    const [pathD, setPathD] = useState("");
    const [dashTotal, setDashTotal] = useState(0);
    const [dashOffset, setDashOffset] = useState(9999);
    const isMobile = () => window.innerWidth <= 768;

    const buildPath = useCallback(() => {
        if (isMobile()) { setPathD(""); return; }
        const section = sectionRef.current;
        const img1 = img1Ref.current;
        const img2 = img2Ref.current;
        const img3 = img3Ref.current;
        if (!section || !img1 || !img2 || !img3) return;

        const secRect = section.getBoundingClientRect();
        const i1 = img1.getBoundingClientRect();
        const i2 = img2.getBoundingClientRect();
        const i3 = img3.getBoundingClientRect();

        setSvgDims({ w: secRect.width, h: secRect.height });

        const cx1 = i1.left - secRect.left + i1.width / 2;
        const cy1 = i1.top  - secRect.top  + i1.height / 2;
        const cx2 = i2.left - secRect.left + i2.width / 2;
        const cy2 = i2.top  - secRect.top  + i2.height / 2;
        const cx3 = i3.left - secRect.left + i3.width / 2;
        const cy3 = i3.top  - secRect.top  + i3.height / 2;

        const midY12 = (cy1 + cy2) / 2;
        const midY23 = (cy2 + cy3) / 2;
        const d = `M ${cx1} ${cy1} C ${cx1} ${midY12}, ${cx2} ${midY12}, ${cx2} ${cy2} C ${cx2} ${midY23}, ${cx3} ${midY23}, ${cx3} ${cy3}`;
        setPathD(d);

        requestAnimationFrame(() => {
            if (pathRef.current) {
                const total = pathRef.current.getTotalLength();
                setDashTotal(total);
                setDashOffset(total);
            }
        });
    }, []);

    const onScroll = useCallback(() => {
        if (isMobile() || !dashTotal) return;
        const img1 = img1Ref.current;
        const img3 = img3Ref.current;
        if (!img1 || !img3) return;

        const i1 = img1.getBoundingClientRect();
        const i3 = img3.getBoundingClientRect();
        const viewH = window.innerHeight;

        const start = i1.top + i1.height / 2;
        const end   = i3.top + i3.height / 2;

        let progress = 0;
        if (end <= viewH) {
            progress = 1;
        } else if (start <= viewH) {
            progress = (viewH - start) / (end - start);
            progress = Math.min(1, Math.max(0, progress));
        }

        setDashOffset(dashTotal * (1 - progress));
    }, [dashTotal]);

    useEffect(() => {
        buildPath();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", buildPath);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", buildPath);
        };
    }, [buildPath, onScroll]);

    return (
        <>
        <div className="sixth" ref={sectionRef} style={{ position: "relative" }}>

            {!isMobile() && svgDims.w > 0 && pathD && (
                <svg
                    className="sixth-svg"
                    width={svgDims.w}
                    height={svgDims.h}
                >
                    <path
                        d={pathD}
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        ref={pathRef}
                        d={pathD}
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={dashTotal}
                        strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 0.06s linear" }}
                    />
                </svg>
            )}

            <div className="six-align" style={{ position: "relative", zIndex: 1 }}>
                <h1>One Platform.<br></br> Your Entire<span className="cas"> Campus Journey.</span></h1>
                <p>RiseIQ walks with you from building your first verified skill to becoming the mentor juniors look up to — all through one connected platform.</p>
            </div>

            <div className="Cardsix" style={{ position: "relative", zIndex: 1 }}>
                <img className="learn" src={learning} ref={img1Ref} onLoad={buildPath}/>
                <div className="gap">
                    <h1>Phase-01<br></br>Build Your<br></br> Verified Profile</h1>
                    <p>Prove what you know — peer & faculty verified</p>
                </div>
            </div>

            <div className="Cardsix Cardsix--column" style={{ position: "relative", zIndex: 1 }}>
                <img className="learn" src={phase2} ref={img2Ref} onLoad={buildPath}/>
                <div className="gap">
                    <h1>Phase-02<br></br>Collaborate,<br></br> Match & Rise</h1>
                    <p>Co-founders, mentors & placement intel — all data-driven</p>
                </div>
            </div>

            <div className="Cardsix" style={{ position: "relative", zIndex: 1 }}>
                <img className="learn" src={phase3} ref={img3Ref} onLoad={buildPath}/>
                <div className="gap">
                    <h1>Phase-03<br></br>Land & Lead.<br></br> Give Back.</h1>
                    <p>Get placed. Your journey becomes the next batch's roadmap.</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Sixthpage;
