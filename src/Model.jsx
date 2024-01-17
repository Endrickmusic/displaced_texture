import React from "react";
import { useGLTF, useEnvironment } from "@react-three/drei";
import { useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader } from '/node_modules/three/src/loaders/TextureLoader'
import { DoubleSide } from "three"
import { useRef } from "react"


export function Model(props) {

  const planeRef = useRef()

   const customUniforms = {
        uTime: { value: 0 }
    }

    useFrame((state, delta) => {
      customUniforms.uTime.value += 0.01
      // planeRef.current.rotation.x = planeRef.current.rotation.y += delta / 12

    })

    const onBeforeCompile = (shader) => 
    {
    shader.uniforms.uTime = customUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
        )

    shader.vertexShader = shader.vertexShader.replace(
            '#include <beginnormal_vertex>',
            `
                #include <beginnormal_vertex>
    
                float angle = sin(position.y + uTime) * 0.2;
                mat2 rotateMatrix = get2dRotateMatrix(angle);
    
                objectNormal.xz = rotateMatrix * objectNormal.xz;
            `
        )

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            transformed.xz = rotateMatrix * transformed.xz;
        `
     )
    }

    const normalTexture = useLoader(TextureLoader, './Textures/waternormals.jpeg')
    const imageTexture = useLoader(TextureLoader, './Textures/gradient.png')
    const envMap = useEnvironment({files : './Environments/envmap.hdr'})

  return (
    <group {...props} dispose={null}>
      <mesh
      ref = { planeRef }
      scale = {0.2}
      rotation = { [-0.2*Math.PI, 0.1*Math.PI, 0] }
      >
       
        <planeGeometry
        args ={[16, 16, 128, 128]}
        
        />
        <meshStandardMaterial 
        onBeforeCompile = { onBeforeCompile }
        color = { 0xffffff }
        map = { imageTexture }
        envMap = { envMap }
        envMapIntensity = { 0.1 }
        // normalMap = {normalTexture }
        normalScale = { [0.07, 0.07] }
        roughness = { 0.12 }
        metalness = { 0.0 }
        side = { DoubleSide }
        
        />

      </mesh>
      
    </group>
  );
}
