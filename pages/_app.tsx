import { useRouter } from 'next/router';
import useStore from '@/helpers/store';
import { useEffect } from 'react';
import Header from '@/config';
import Dom from '@/components/layout/dom';
import dynamic from 'next/dynamic';
import "../styles/globals.css"
import { useModalStore } from '@/modal-store';
const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: false,
});

function App({ Component, pageProps = { title: 'index' } }) {
  const router = useRouter();

  useEffect(() => {
    useStore.setState({ router });
  }, [router]);

  return (
    <>
      <Header title={pageProps.title} />
      <Dom>
        <Component {...pageProps} />
      </Dom>
      <GlobalModal/>
      {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
    </>
  );
}

export default App;

const GlobalModal = ()=>{
  const {show,Componente,matarModal} = useModalStore()
  
  if(!show) return null
  return <div className={"modalWrapper"}>
    <div className='modalContent'>
      <div  onClick={() => matarModal(false)}> <h3 style={{cursor:"pointer"}}>X</h3> </div>
      <Componente/>
    </div>
  </div>
}
