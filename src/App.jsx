import { useState } from 'react'
import Logo from '/face-blowing-a-kiss.svg'
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

import { Model } from "./Model.jsx"
import Shader from "./Shader.jsx"
import './index.css'

export default function App() {
  
  const [count, setCount] = useState(0)

 return (


    <Canvas 
      shadows 
      camera={{ position: [2, 2, 7], fov: 40 }}
      flat = { true }
      >
      <OrbitControls />
      <ambientLight 
        intensity = { 0.0}
      />
      <directionalLight 
      position={[5, 5, 5]} 
      intensity={0.4} />
      <pointLight 
      position={[-3, -3, 2]}
      intensity={0.0} 
      />
      {/* <Environment
        files = "./Environments/envmap.hdr"
         
        /> */}
        <Model />
        {/* <Shader /> */}
    </Canvas>
  
  );
}

