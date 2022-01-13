import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGL1Renderer } from 'three';


const Home: NextPage = () => {
    const [scene, setScene] = useState<Scene | null>(null);
    const [camera, setCamera] = useState<PerspectiveCamera | null>(null);
    const [render, setRender] = useState<WebGL1Renderer | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    // Classes declaration
    useEffect(() => {
        setScene(new Scene());
        setCamera(new PerspectiveCamera(75, window.innerWidth / window.innerWidth, 0.1, 1000));
        setRender(new WebGL1Renderer());

    }, []);


    const { current: canvas } = canvasRef;

    if (canvas && render) {
        render.setSize(window.innerWidth, window.innerHeight);
        //Check if cavas does not have a child
        if (canvas.childElementCount === 0) {
            canvas.appendChild(render.domElement);
        }

    }

    return (
        <div ref={canvasRef}>
        </div>
    )
}

export default Home
