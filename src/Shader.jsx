import { OrbitControls, useTexture, useAspect } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo } from "react"

import vertexShader from "./shader/vertexShader.js"
import fragmentShader from "./shader/fragmentShader.js"
import { DoubleSide, Vector2 } from "three"


export default function Shader(){

    const meshRef = useRef();
    
    // Load the noise texture and update the shader uniform
    const texture01 = useTexture("./textures/gradient.png")
    console.log(texture01.image.width)
    

    const size = useAspect(texture01.image.width, texture01.image.height)

    const viewport = useThree(state => state.viewport)
    const pixel = useThree(state => state.size)


    useFrame((state) => {
      let time = state.clock.getElapsedTime()
  
      
      meshRef.current.material.uniforms.uTime.value = time
      meshRef.current.material.uniforms.uResolution.value = new Vector2(pixel.x, pixel.y);
      
    })
  
    console.log(pixel)

      // Define the shader uniforms with memoization to optimize performance
      const uniforms = useMemo(
        () => ({
          uTime: {
            type: "f",
            value: 1.0,
              },
          uResolution: {
            type: "v2",
            value: new Vector2(viewport.width, viewport.height),
            },
          texture01: {
              type: "t",
              value: texture01,
          },
         }),[viewport.width, viewport.height, texture01]
      )   

  return (
    <>
      <OrbitControls />    
      <mesh 
      ref = { meshRef }
      scale = { size }
      position = {[20, -5, 0]}
      >
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            side={DoubleSide}
          />
        </mesh>
   </>
  )}
