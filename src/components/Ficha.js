/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/ficha.glb');
export default function Ficha({ ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/ficha.glb');

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.Fichas.geometry}
        position={[props.x, props.y, props.z]}
        onClick={props.onClick}
      >
        <meshStandardMaterial color={props.color} />
      </mesh>
    </group>
  );
}

