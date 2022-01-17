import type { NextPage } from 'next';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Scene, PerspectiveCamera, WebGL1Renderer, BoxGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, DoubleSide, MeshPhongMaterial, DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type World = {
    plane: {
        width: number,
        height: number,
        widthSegments: number,
        heightSegments: number,
    }
}

const generatePlane = (planeMesh: Mesh<PlaneGeometry, MeshPhongMaterial>, world: World) => {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
    const array: ArrayLike<number> = planeMesh.geometry.attributes.position.array;

    for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];


        array[i + 2] = z + Math.random();
    }
}

const init = async (planeMesh: Mesh<PlaneGeometry, MeshPhongMaterial>) => {
    const dat = await import('dat.gui');
    const gui = new dat.GUI();
    const world = {
        plane: {
            width: 10,
            height: 10,
            widthSegments: 10,
            heightSegments: 10,
        }
    }

    gui.add(world.plane, "width", 1, 20).onChange(() =>
        generatePlane(planeMesh, world));

    gui.add(world.plane, "height", 1, 20).onChange(() => generatePlane(planeMesh, world));

    gui.add(world.plane, "widthSegments", 1, 50).onChange(() => generatePlane(planeMesh, world));

    gui.add(world.plane, "heightSegments", 1, 50).onChange(() => generatePlane(planeMesh, world));

}
interface ArrayLike<T> {
    length: number;
    [n: number]: T;
}

const Home: NextPage = () => {

    const [render, setRender] = useState<WebGL1Renderer | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);



    const handleWindowResize = useCallback(() => {

        const { current: canvas } = canvasRef;
        if (canvas && render) {
            const scw = canvas.clientWidth;
            const sch = canvas.clientHeight;
            render.setSize(scw, sch);
        }
    }, [render]);


    const handleMouseOver = () => {
        console.log("mouse over");
    }


    useEffect(() => {
        const { current: canvas } = canvasRef;
        setRender(new WebGL1Renderer());

        if (canvas && !render) {

            const scw = canvas.clientWidth;
            const sch = canvas.clientHeight;
            const render = new WebGL1Renderer();
            const scene = new Scene();
            const camera = new PerspectiveCamera(75, scw / sch, 0.1, 1000);

            render.setSize(scw, sch);
            render.setPixelRatio(devicePixelRatio);
            canvas.appendChild(render.domElement);
            new OrbitControls(camera, render.domElement);
            setRender(render);


            const planeGeometry = new PlaneGeometry(10, 10, 10, 10);
            const planeMaterial = new MeshPhongMaterial({
                color: 0xff0000,
                side: DoubleSide,
                flatShading: true
            });
            const planeMesh = new Mesh(planeGeometry, planeMaterial);
            scene.add(planeMesh)
            init(planeMesh);
            camera.position.z = 5;

            const light = new DirectionalLight(0xffffff, 1)
            light.position.set(0, 0, 1);
            scene.add(light);

            const backLight = new DirectionalLight(0xffffff, 1);
            backLight.position.set(0, 0, -1);
            scene.add(backLight);

            const array: ArrayLike<number> = planeMesh.geometry.attributes.position.array;

            for (let i = 0; i < array.length; i += 3) {
                const x = array[i];
                const y = array[i + 1];
                const z = array[i + 2];


                array[i + 2] = z + Math.random();
            }


            const animate = () => {
                requestAnimationFrame(animate);
                render.render(scene, camera);
                // planeMesh.rotation.x += 0.01;
            }

            animate();

        }


    }, []);


    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false);
        return () => {
            window.removeEventListener('resize', handleWindowResize, false);
        }

    }, [render, handleWindowResize]);

    useEffect(() => {
        window.addEventListener("mouseover", handleMouseOver, false);
        return () => {
            window.removeEventListener("mouseover", handleMouseOver, false);
        }
    })

    return (
        <div className='h-screen w-screen overflow-x-hidden'>
            <div className="h-full" ref={canvasRef}>

            </div>

        </div>
    )
}

export default Home
