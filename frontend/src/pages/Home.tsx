
import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Window from '../components/Window';
import Info from '../components/info';
import { Link } from 'react-scroll';

function Home() {


  // Word change

  // text animation

  return (
    <>
      <Navbar />
      <div className="main-title">
        <div >
          <div className={`centered-content`}>
            <h1>Erdős Szám</h1>
            <p>An Erdős Number visualizer</p>
          </div>
        
        </div>
        <Link to="window-section" smooth={true} duration={10} className='arrow'></Link>
      </div>

      <div id='window-section'>
        <Window />
      </div>
      
      <div id='about-section'>
        <Info />
      </div>
    </>
  );
}

export default Home;




