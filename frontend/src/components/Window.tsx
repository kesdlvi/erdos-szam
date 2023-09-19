import { useState } from "react";
import React from "react";
import './Window.css';
import Graph from "./Graph";

const Window = () => {
    const [showDropWindow, setDropWindow] = useState(false)

    


    return (
        <div className="window-container" id = "window-container">
            <div className="Window" >
                <Graph/>
                
            </div>
        </div>
    );
};



export default Window