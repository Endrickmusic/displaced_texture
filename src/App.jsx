import { useState } from 'react'
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
        intensity = { 0.3 }
      />
      <directionalLight 
      position={[0.2, 0.5, 0.2]} 
      intensity={0.35} 
      castShadow
      />
      <pointLight 
      position={[-3, -3, 2]}
      intensity={0.0} 
      />
      {/* <Environment
        files = "./Environments/envmap.hdr"
         
        /> */}
        <Model 
        receiveShadow
        />
        {/* <Shader /> */}
        <mesh
        receiveShadow
        position = {[0, -2, 0]}
        rotation = {[-0.5*Math.PI, 0, 0]}
        >
        <planeGeometry args={[6,6,32,32]} />  
        <meshStandardMaterial 
        color={0xffffff}
        />     
        </mesh>
    </Canvas>
  
  );
}

