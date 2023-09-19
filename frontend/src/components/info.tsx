import React, { useRef, useEffect, useState } from 'react';
import './info.css'
const Info = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
        document.body.style.overflow = 'hidden'

    };

    const closeModal = () => {
        setModalVisible(false);
        document.body.style.overflow = 'auto'
    };

    return (
        <div className='info-section'>
        <h1 onClick={openModal}>What is Erdős Szam?</h1>
        {isModalVisible && (
            <div className='modal'>
            <div className='modal-content'>
                {/* Add your modal content here */}
                <div className = 'modal-section'>
                    <div className='modal-about'> ℹ️ about</div>
                    <h2>Erdős Szám is an <a href="https://en.wikipedia.org/wiki/Erd%C5%91s_number">Erdős Number</a> visalization tool
                    aimed at finding connections between authors of mathematical papers. Each author is represented by a <a href="https://en.wikipedia.org/wiki/Node_(computer_science)"> node</a>,
                    with its color representing that author's Erdős Number. 
                    </h2>
                </div>
                
                <div className = 'modal-section'>
                    <div className='modal-about'>📚 data structures</div>
                        <h2>
                            The data is represented by a <a href="https://mathworld.wolfram.com/RootedTree.html">rooted tree</a>,
                            which is a type of <a href="https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)">graph</a>. 
                            Our <a href="https://mathworld.wolfram.com/RootVertex.html">root</a> node is mathematician <a href="https://en.wikipedia.org/wiki/Paul_Erd%C5%91s">Paul Erdős</a>, who himself has worked on many branches of mathematics like 
                            <a href="https://en.wikipedia.org/wiki/Graph_theory"> graph theory.</a> 
                        </h2>
                </div>

                <div className='modal-section'>
                    <div className='modal-about'>🗂️ data set</div>
                    <h2>
                        By default, most of our data surrounding authors and node information comes from the internet. 
                        We encourage those to submit node requests to help expand the database.
                    </h2>
                </div>
                
                <div className='modal-section'>
                    <div className='modal-about'>🌟 bugs and features</div>
                    <h2>
                        If you encounter bugs, or would like to suggest a feature feel free to <a href="">contact us</a> 
                    </h2>

                </div>
                 
                 
                <button onClick={closeModal}>Close</button>
            </div>
            </div>
        )}
        </div>
    );
};

export default Info;
