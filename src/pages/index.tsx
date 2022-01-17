import type { NextPage } from 'next';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Scene, PerspectiveCamera, WebGL1Renderer, Mesh, PlaneGeometry, DoubleSide, MeshPhongMaterial, DirectionalLight, Raycaster, BufferAttribute, } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';




type World = {
    plane: {
        width: number,
        height: number,
        widthSegments: number,
        heightSegments: number,
    }
}

type Mouse = {
    x: number,
    y: number,
}

const world: World = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50,
    }
}

const generatePlane = (planeMesh: Mesh<PlaneGeometry, MeshPhongMaterial>) => {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
    const array: ArrayLike<number> = planeMesh.geometry.attributes.position.array;

    const randomValue: number[] = [];
    //Verticy position randomisation


    for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) {
            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];

            array[i] = x + (Math.random() - 0.5) * 3;
            array[i + 1] = y + (Math.random() - 0.5) * 3;
            array[i + 2] = z + (Math.random() - 0.5) * 3;
        }
        randomValue.push(Math.random() * Math.PI * 2);
    }

    // @ts-ignore
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;

    //@ts-ignore
    planeMesh.geometry.attributes.position.randomValue = randomValue;

    //Color attribute addition
    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4);
    }
    planeMesh.geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
}

const init = async (planeMesh: Mesh<PlaneGeometry, MeshPhongMaterial>) => {
    const dat = await import('dat.gui');
    const gui = new dat.GUI();


    gui.add(world.plane, "width", 1, 500).onChange(() =>
        generatePlane(planeMesh));

    gui.add(world.plane, "height", 1, 500).onChange(() => generatePlane(planeMesh));

    gui.add(world.plane, "widthSegments", 1, 100).onChange(() => generatePlane(planeMesh));

    gui.add(world.plane, "heightSegments", 1, 100).onChange(() => generatePlane(planeMesh,));

}
interface ArrayLike<T> {
    length: number;
    [n: number]: T;
}

const Home: NextPage = () => {
    const [mouse, setMouse] = useState<Mouse>({
        x: 0,
        y: 0,
    });
    const [render, setRender] = useState<WebGL1Renderer | null>(null);
    const [scene, setScene] = useState<Scene | null>(null);
    const [camera, setCamera] = useState<PerspectiveCamera | null>(null);
    const [raycaster, setRaycaster] = useState<Raycaster | null>(null);
    const [planeMesh, setPlaneMesh] = useState<Mesh<PlaneGeometry, MeshPhongMaterial> | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);



    const handleWindowResize = useCallback(() => {

        const { current: canvas } = canvasRef;
        if (canvas && render) {
            const scw = canvas.clientWidth;
            const sch = canvas.clientHeight;
            render.setSize(scw, sch);
        }
    }, [render]);



    let intersects: any[] = [];

    const animate = () => {
        requestAnimationFrame(animate);
        if (raycaster && planeMesh) {
            raycaster.setFromCamera(mouse, camera!);
            intersects = raycaster!.intersectObject(planeMesh!);
        }
    }

    const handleMouseMove = useCallback((event: MouseEvent) => {
        setMouse({
            x: (event.clientX / innerWidth) * 2 - 1,
            y: -(event.clientY / innerHeight) * 2 + 1,
        });

    }, [mouse.x, mouse.y]);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove, false);
        animate();
        if (intersects.length > 0) {
            const { color } = intersects[0].object.geometry.attributes;


            //Verticy 1
            color.setX(intersects[0].face.a, 0.1);
            color.setY(intersects[0].face.a, 0.5);
            color.setZ(intersects[0].face.a, 1);

            //Verticy 2
            color.setX(intersects[0].face.b, 0.1);
            color.setY(intersects[0].face.b, .5);
            color.setZ(intersects[0].face.b, 1);

            //Verticy 3
            color.setX(intersects[0].face.c, 0.1);
            color.setY(intersects[0].face.c, .5);
            color.setZ(intersects[0].face.c, 1);


            color.needsUpdate = true;

            const initialColor = {
                r: 0,
                g: 0.19,
                b: 0.4
            }

            const hoverColor = {
                r: 0.1,
                g: 0.5,
                b: 1
            }

            gsap.to(hoverColor, {
                r: initialColor.r,
                g: initialColor.g,
                b: initialColor.b,
                duration: 1,
                onUpdate: () => {

                    //Verticy 1
                    color.setX(intersects[0] && intersects[0].face.a, hoverColor.r);
                    color.setY(intersects[0] && intersects[0].face.a, hoverColor.g);
                    color.setZ(intersects[0] && intersects[0].face.a, hoverColor.b);

                    //Verticy 2
                    color.setX(intersects[0] && intersects[0].face.b, hoverColor.r);
                    color.setY(intersects[0] && intersects[0].face.b, hoverColor.g);
                    color.setZ(intersects[0] && intersects[0].face.b, hoverColor.b);

                    //Verticy 3
                    color.setX(intersects[0] && intersects[0].face.c, hoverColor.r);
                    color.setY(intersects[0] && intersects[0].face.c, hoverColor.g);
                    color.setZ(intersects[0] && intersects[0].face.c, hoverColor.b);
                    color.needsUpdate = true;
                }
            })

        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove, false);
        }
    }, [mouse.x, mouse.y]);



    useEffect(() => {
        const { current: canvas } = canvasRef;
        setRender(new WebGL1Renderer());

        if (canvas && !render) {

            const scw = canvas.clientWidth;
            const sch = canvas.clientHeight;
            const render = new WebGL1Renderer();
            const scene = new Scene();
            const camera = new PerspectiveCamera(75, scw / sch, 0.1, 1000);
            const raycaster = new Raycaster();

            render.setSize(scw, sch);
            render.setPixelRatio(devicePixelRatio);
            canvas.appendChild(render.domElement);
            new OrbitControls(camera, render.domElement);
            setRender(render);


            const planeGeometry = new PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
            const planeMaterial = new MeshPhongMaterial({
                side: DoubleSide,
                flatShading: true,
                vertexColors: true,
            });
            const planeMesh = new Mesh(planeGeometry, planeMaterial);
            scene.add(planeMesh)
            init(planeMesh);
            camera.position.z = 50;

            const light = new DirectionalLight(0xffffff, 1)
            light.position.set(0, -1, 1);
            scene.add(light);

            const backLight = new DirectionalLight(0xffffff, 1);
            backLight.position.set(0, 0, -1);
            scene.add(backLight);

            generatePlane(planeMesh);


            let frame: number = 0;
            const animate = () => {
                requestAnimationFrame(animate);
                render.render(scene, camera);
                frame += 0.01;
                const array: ArrayLike<number> = planeMesh.geometry.attributes.position.array;
                //@ts-ignore
                const { originalPosition, randomValue } = planeMesh.geometry.attributes.position;
                for (let i = 0; i < array.length; i += 3) {
                    //x
                    array[i] = originalPosition[i] + Math.cos(frame + randomValue[i]) * 0.01;
                    //y
                    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValue[i]) * 0.01;
                }

                planeMesh.geometry.attributes.position.needsUpdate = true;
            }

            animate();

            setScene(scene);
            setCamera(camera);
            setPlaneMesh(planeMesh)
            setRaycaster(raycaster);

        }


    }, []);


    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false);
        return () => {
            window.removeEventListener('resize', handleWindowResize, false);
        }

    }, [render, handleWindowResize]);



    return (
        <div className='h-screen w-screen overflow-x-hidden'>
            <div className="h-full" ref={canvasRef}>

            </div>

        </div>
    )
}

export default Home
