import { useState } from 'react'
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";

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
      <SoftShadows 
        size = {15}
        samples = {15}
        focus = {0.5}
      />
      <OrbitControls />
      <ambientLight 
        intensity = { 0.3 }
      />
      <directionalLight 
      position={[0.2, 0.5, 0.2]} 
      intensity={0.35} 
      shadow-mapSize={1024}
      castShadow
      />

      <directionalLight 
      position={[-1.2, 0.7, 0.2]} 
      intensity={0.35} 
      shadow-mapSize={1024}
      castShadow
      />

      <Model 
      receiveShadow
      />
    
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

