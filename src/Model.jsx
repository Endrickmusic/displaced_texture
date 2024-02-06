import React from "react";
import { useEnvironment, useTexture } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { DoubleSide, MathUtils, RGBADepthPacking, MeshDepthMaterial } from "three"
import { useRef, useEffect } from "react"


export function Model(props) {
  console.log("Model component rendered");
  const planeRef = useRef()
  const materialRef = useRef()

  const hovered = useRef(false)
  const transValue = hovered.current ? 3.0 : 1.0
  console.log('hovered:', hovered.current)
  console.log(planeRef.current)

   const customUniforms = {
        uTime: { value: 0 },
        uDisplay : { value: 1.0 }
    }

    useFrame((state, delta) => {
      customUniforms.uTime.value += 0.01
      const transValue = hovered.current ? 3.0 : 1.0
      // planeRef.current.rotation.x = planeRef.current.rotation.y += delta / 12
      customUniforms.uDisplay.value = MathUtils.lerp(customUniforms.uDisplay.value, transValue, 0.075)
      // customUniforms.uDisplay.value += 0.001 
      // console.log('Time:', customUniforms.uTime.value);
      console.log('Display:', customUniforms.uDisplay.value);
      console.log('hovered:', hovered.current)
      // if (materialRef.current && materialRef.current.onBeforeCompile) {
      //   materialRef.current.onBeforeCompile();
      // }
    })
    
    const depthMaterial = new MeshDepthMaterial({
      depthPacking: RGBADepthPacking
    })

    function modMaterial() {
    planeRef.current.material.onBeforeCompile = (shader) => {

        console.log('Shader compilation triggered')
    shader.uniforms = {...customUniforms, ...shader.uniforms }  

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;
            uniform float uDisplay;

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
    
                float angleX = sin(position.x + uTime) * 0.03 * uDisplay;
                float angleX2 = cos(position.x + (uTime * 1.1)) * 0.07 * uDisplay;
                float angleY = cos(position.y + (uTime * 0.7)) * 0.04 * uDisplay;
                float angleY2 = sin(position.y + (uTime * 0.1)) * 0.06 * uDisplay;

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
  }

  depthMaterial.onBeforeCompile = (shader) =>
   {
    shader.uniforms = {...customUniforms, ...shader.uniforms }  

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
          #include <common>

          uniform float uTime;
          uniform float uDisplay;

          mat2 get2dRotateMatrix(float _angle)
          {
              return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
          }
      `
      )

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
            float angleX = sin(position.x + uTime) * 0.03 * uDisplay;
                float angleX2 = cos(position.x + (uTime * 1.1)) * 0.07 * uDisplay;
                float angleY = cos(position.y + (uTime * 0.7)) * 0.04 * uDisplay;
                float angleY2 = sin(position.y + (uTime * 0.1)) * 0.06 * uDisplay;

                mat2 rotateMatrixX = get2dRotateMatrix(angleX);
                mat2 rotateMatrixX2 = get2dRotateMatrix(angleX2);
                mat2 rotateMatrixY = get2dRotateMatrix(angleY);
                mat2 rotateMatrixY2 = get2dRotateMatrix(angleY2);

                transformed.xz = rotateMatrixX * transformed.xz;
                transformed.xz = rotateMatrixX2 * transformed.xz;
                transformed.xz = rotateMatrixY * transformed.xz;
                transformed.xz = rotateMatrixY2 * transformed.xz;
      `
      )
   }

    useEffect(() => {
      console.log('useEffect triggered')
      console.log(materialRef)
        modMaterial()
        console.log(materialRef.customProgramCacheKey)     
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
