import dynamic from 'next/dynamic';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from 'react';
import { OrbitControls, PerspectiveCamera, PresentationControls } from '@react-three/drei';
import Ficha from "../Ficha"
// Step 5 - delete Instructions components
// import Shader from '@/components/canvas/Shader/Shader'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
  ssr: false,
});

// dom components goes here
const Page = (props) => {
  return <></>;
};

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
const Scene = () => {
  const gltf = useLoader(GLTFLoader, '/parquesv7.glb');
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
};

// La posicion es x,z,y signo contrario 
// Tener en cuenta que en el componente ficha ya estan arregladas las posiciones
// Pasar el x,y,z normal del blender
const posicionInicial = {
  x:0.06,
  y:-0.84,
  z:-0.0155,
  sizeX:0.0234
}
Page.r3f = (props) => (
  <>
    <ambientLight />
    <OrbitControls {...props} />
    {[0,1,2,3,4,5].map(i =>  <Ficha  x={posicionInicial.x - posicionInicial.sizeX * i} y={-0.84} z={-0.0155}/>)}
    {[0,1,2,3,4,5].map(i =>  <Ficha  x={posicionInicial.x - posicionInicial.sizeX * i} y={-0.84 + 0.058} z={-0.0155 + 0.02}/>)}


    <Scene />
  </>
);

export default Page;

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  };
}
