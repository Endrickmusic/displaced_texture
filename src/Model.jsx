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
    
                float angleX = sin(position.x + uTime) * 0.04;
                float angleX2 = cos(position.x + (uTime * 1.1)) * 0.12;
                float angleY = cos(position.y + (uTime * 0.7)) * 0.11;
                float angleY2 = sin(position.y + (uTime * 0.1)) * 0.08;

                mat2 rotateMatrixX = get2dRotateMatrix(angleX);
                mat2 rotateMatrixX2 = get2dRotateMatrix(angleX2);
                mat2 rotateMatrixY = get2dRotateMatrix(angleY);
                mat2 rotateMatrixY2 = get2dRotateMatrix(angleY2);

                objectNormal.xz = rotateMatrixX * objectNormal.xz;
                objectNormal.xz = rotateMatrixX2 * objectNormal.xz;
                objectNormal.xz = rotateMatrixY * objectNormal.xz;
                objectNormal.xz = rotateMatrixY2 * objectNormal.xz;
            `
        )

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            transformed.xz = rotateMatrixX * transformed.xz;
            transformed.xz = rotateMatrixX2 * transformed.xz;
            transformed.xz = rotateMatrixY * transformed.xz;
            transformed.xz = rotateMatrixY2 * transformed.xz;
        `
     )
    }

    const normalTexture = useLoader(TextureLoader, './textures/waternormals.jpeg')
    const imageTexture = useLoader(TextureLoader, './textures/gradient.png')
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
        envMapIntensity = { 0.2 }
        normalMap = {normalTexture }
        normalScale = { [0.035, 0.035] }
        roughness = { 0.22 }
        metalness = { 0.0 }
        side = { DoubleSide }
        
        />

      </mesh>
      
    </group>
  );
}
