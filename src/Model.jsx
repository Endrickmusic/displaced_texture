import React from "react";
import { useEnvironment, useTexture } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { DoubleSide, MathUtils, RGBADepthPacking, MeshDepthMaterial } from "three"
import { useRef, useEffect } from "react"

import ModifiedShader from './ModifiedShader.jsx'

export function Model(props) {
  console.log("Model component rendered");
  const planeRef = useRef()
  const materialRef = useRef()

  const hovered = useRef(false)
  const transValue = hovered.current ? 3.0 : 1.0
  console.log('hovered:', hovered.current)
  console.log(planeRef.current)

    useFrame((state, delta) => {
      customUniforms.uTime.value += 0.01
      const transValue = hovered.current ? 3.0 : 1.0
      // planeRef.current.rotation.x = planeRef.current.rotation.y += delta / 12
      customUniforms.uDisplay.value = MathUtils.lerp(customUniforms.uDisplay.value, transValue, 0.075)
      // console.log('Time:', customUniforms.uTime.value);
      console.log('Display:', customUniforms.uDisplay.value);
      console.log('hovered:', hovered.current)
    })
    
    useEffect(() => {
      console.log('useEffect triggered')
      console.log(materialRef)
        ModifiedShader(...props)    
    }, [hovered])

    const normalTexture = useTexture('./textures/waternormals.jpeg')
    const imageTexture = useTexture('./textures/gradient.png')
    const envMap = useEnvironment({files : './Environments/envmap.hdr'})

  return (
    <group {...props} dispose={null}>
      <mesh
      ref = { planeRef }
      scale = {0.2}
      rotation = { [-0.2*Math.PI, 0.1*Math.PI, 0] }
      onPointerOver = {(e) => hovered.current = true}
      onPointerOut = {(e) => hovered.current = false}
      customDepthMaterial={depthMaterial}
      castShadow
      receiveShadow
      >
       
        <planeGeometry
        args ={[16, 16, 128, 128]}
        
        />
        <meshStandardMaterial 
        ref={ materialRef }
        // onBeforeCompile = { onBeforeCompile }
        color = { 0xffffff }
        map = { imageTexture }
        envMap = { envMap }
        envMapIntensity = { 0.0 }
        normalMap = {normalTexture }
        normalScale = { [0.035, 0.035] }
        roughness = { 0.12 }
        metalness = { 0.5 }
        side = { DoubleSide }
        flatShading = { false }
        emissiveIntensity = { .75 }
        emissiveMap = { imageTexture }
        emissive = { 0xffffff }
        />

      </mesh>
      
    </group>
  );
}
