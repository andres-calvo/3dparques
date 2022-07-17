/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ x,y,z,...props}) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/ficha.glb')
  console.log(materials)
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Fichas.geometry}  color={"rgb(10, 20, 30)"} position={[x, z, y]} />
    </group>
  )
}

useGLTF.preload('/ficha.glb')