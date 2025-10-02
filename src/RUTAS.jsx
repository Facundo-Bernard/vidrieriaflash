 import React from 'react'
 import { Route, Routes } from 'react-router-dom'
 import LANDINGPAGE from './LANDINGPAGE/LANDINGPAGE'
import ContactoForm from './CONTACTANOS/CONTACTANOS'

 function RUTAS() {

  return (
    <>
       <Routes>
      <Route path='/' element={<LANDINGPAGE/>}></Route>
      <Route path='/contactanos' element={<ContactoForm></ContactoForm>}></Route>
    </Routes> 
    </>
  )
}

export default RUTAS

 
 
 
 
   