import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Request from './Request';


function App() {
 
  

  return (
    <BrowserRouter>
      
      
      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path="/request" element={<Request/>} />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
