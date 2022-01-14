import type { NextPage } from 'next';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Scene, PerspectiveCamera, WebGL1Renderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';


const Home: NextPage = () => {
    const [scene, setScene] = useState<Scene | null>(new Scene());
    const [camera, setCamera] = useState<PerspectiveCamera | null>(null);
    const [render, setRender] = useState<WebGL1Renderer | null>(null);
    const [box, setBox] = useState<BoxGeometry | null>(null);
    const [material, setMaterial] = useState<MeshBasicMaterial | null>(null);
    const [mesh, setMesh] = useState<Mesh | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);



    const handleWindowResize = useCallback(() => {

        const { current: canvas } = canvasRef;
        if (canvas && render) {
            const scw = canvas.clientWidth;
            const sch = canvas.clientHeight;
            render.setSize(scw, sch);
        }
    }, [render]);



    useEffect(() => {
        const { current: canvas } = canvasRef;
        setRender(new WebGL1Renderer());
        if (canvas && !render) {
            const scw = canvas.clientWidth;
            const sch = canvas.clientHeight;
            const render = new WebGL1Renderer();
            render.setSize(scw, sch);
            canvas.appendChild(render.domElement);
            setRender(render);

            const scene = new Scene();
            const camera = new PerspectiveCamera(75, scw / sch, 0.1, 1000);
            const box = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial({ color: 0x00ff00 });
            const mesh = new Mesh(box, material);
            scene.add(mesh);
            camera.position.z = 5;
            setCamera(camera);
            setScene(scene);
            setBox(box);
            setMaterial(material);
            setMesh(mesh);

            render.render(scene, camera);

        }


    }, []);


    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false);
        return () => {
            window.removeEventListener('resize', handleWindowResize, false);
        }

    }, [render, handleWindowResize]);



    return (
        <div className='h-screen w-screen'>
            <div className="h-full" ref={canvasRef}>

            </div>
        </div>
    )
}

export default Home
