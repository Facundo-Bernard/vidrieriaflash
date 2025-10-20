import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NAVBAR from './LANDINGPAGE/NAVBAR/NAVBAR'
import RUTAS from './RUTAS'
import Footer from './LANDINGPAGE/FOOTER/Footer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NAVBAR></NAVBAR>
      <RUTAS></RUTAS>
      <Footer ></Footer>
    </>
  )
}

export default App
