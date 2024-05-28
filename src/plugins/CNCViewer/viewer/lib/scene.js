/**
 * @fileoverview ThreeJS Scene Management
 */

//Imports
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import
{
    ArrowHelper,
    Color,
    HemisphereLight,
    Mesh,
    MeshBasicMaterial,
    MOUSE,
    GridHelper,
    PerspectiveCamera,
    OrthographicCamera,
    PlaneBufferGeometry,
    CylinderGeometry,
    Scene,
    Vector3,
    WebGLRenderer
} from 'three';
import state from './state';

//Resize event handler
const resize = () => {
    //Update renderer
    state.renderer.setSize(state.canvas.clientWidth, state.canvas.clientHeight);

    //Update camera aspect ratio
    state.camera.aspect = state.canvas.clientWidth / state.canvas.clientHeight;
    state.camera.updateProjectionMatrix();
};

//Export
export const setup = async (canvas, plane, theme) => {
    //Store variables
    state.canvas = canvas;

    //Scene
    state.scene = new Scene();
    state.scene.background = new Color(0xECF5F7);

    //Light
    state.light = new HemisphereLight(0xffffff, 0x505050);
    state.light.position.set(0, 10, 0);
    state.scene.add(state.light);

    // Plane

    state.plane = new GridHelper(20, 20, 0x979797, 0xC4C4C4);


    state.plane.position.set(0, 0, 0);

    // state.plane = new Mesh(plane.X, plane.X)new PlaneBufferGeometry(), new MeshBasicMaterial({
    //     colorGrid: new Color(theme.plane), opacity: 0.5
    // }));
    // state.plane.scale.set(plane.X, plane.Y, 1);
    // state.plane.rotateX(- Math.PI / 2);
    state.scene.add(state.plane);

    const XDir = new Vector3( -1, 0, 0 );
    XDir.normalize();
    const YDir = new Vector3( 0, 0, 1 );
    YDir.normalize();
    const ZDir = new Vector3( 0, 1, 0 );
    ZDir.normalize();
    const origin = new Vector3( 0, 0, 0 );

    const XArrowHelper = new ArrowHelper( XDir, origin, 2, 0xFF532C );
    state.scene.add(XArrowHelper);
    const YArrowHelper = new ArrowHelper( YDir, origin, 2, 0x2CFF66 );
    state.scene.add(YArrowHelper);
    const ZArrowHelper = new ArrowHelper( ZDir, origin, 2, 0x2C62FF );
    state.scene.add(ZArrowHelper);

    const geometry = new CylinderGeometry( 0.1, 0.1, 2, 32 );
    const material = new MeshBasicMaterial({
        color: 0x566F6C
    });
    state.drill = new Mesh( geometry, material );

    state.drill.position.set(0, 6, 0);
    state.scene.add(state.drill);

    //Renderer
    state.renderer = new WebGLRenderer({
        antialias: true
    });
    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.renderer.setSize(state.canvas.clientWidth, state.canvas.clientHeight);
    state.canvas.appendChild(state.renderer.domElement);

    //Resize
    window.addEventListener('resize', resize);

    //Camera
    state.camera = new PerspectiveCamera(20, state.canvas.clientWidth / state.canvas.clientHeight, 0.1, 200);
    state.camera.position.set(0, 100, 0);
    state.camera.lookAt( state.scene.position );

    //Orbit controls
    state.controls = new OrbitControls(state.camera, state.canvas);
    state.controls.rotateSpeed = 0.7;
    state.controls.minDistance = 1;
    state.controls.maxDistance = 150;
    state.controls.minPolarAngle = 0;
    state.controls.maxPolarAngle = Math.PI;
    state.controls.mouseButtons = {
        LEFT: MOUSE.PAN,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.ROTATE
    };

    //Animation loop
    const animate = () => {
        //Update orbit controls
        state.controls.update();

        //Render
        state.renderer.render(state.scene, state.camera);

        //Recur
        state.renderID = requestAnimationFrame(animate);
    };
    animate();
};

//Export
export const teardown = () => {
    //Resize
    window.removeEventListener('resize', resize);

    //Cleanup scene
    for ( const mesh of state.scene.children ) {
        //Geometry
        if ( mesh.geometry != null && typeof mesh.geometry.dispose == 'function' ) {
            mesh.geometry.dispose();
        }

        //Material
        if ( mesh.material != null && typeof mesh.material.dispose == 'function' ) {
            mesh.material.dispose();
        }
    }

    //Stop animation loop
    cancelAnimationFrame(state.renderID);

    //Cleanup controls and renderer
    state.controls.dispose();
    state.renderer.dispose();
};