import React from "react";
import "./Cover.css";
import coverImg from "../assets/me4.png";

function Cover() {
    return (
        <div className="cover-main">
            <img className="cover-img" src={coverImg} alt="cover" />
        </div>
    );
}

export default Cover;