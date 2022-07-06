/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ x,y,z,...props}) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/ficha.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Fichas.geometry} material={materials.FichaMaterial} position={[x, z, y*-1]} />
    </group>
  )
}

useGLTF.preload('/ficha.glb')
