import React from "react";
import { useState } from "react";
import "./Path.css"
import Graph from "./Graph";


interface PathProps {
    visitedNodes: Node[];
    closeModal: ()=> void; 
}


const Path: React.FC<PathProps> = ({ visitedNodes, closeModal }) => {
    return (
      <div className="Modal">
        <div className="path-content">
          <ul className="node-list-container">
            {visitedNodes.map((node, index) => (
              <React.Fragment key={node._id}>
                <li className="node-container">
                  <span className="node-name">{node.name}</span>
                  {index < visitedNodes.length - 1 && <div className="node-link"></div>}
                </li>
              </React.Fragment>
            ))}
          </ul>
  
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    );
  }
  

export default Path; 