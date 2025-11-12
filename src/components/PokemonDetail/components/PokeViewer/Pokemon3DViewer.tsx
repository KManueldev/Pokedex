
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import styles from './Pokemon3DViewer.module.scss';

interface Props {
  pokemonId: number;
  onClose: () => void;
}

export const PokeViewer = ({ pokemonId, onClose }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const controlsRef = useRef<OrbitControls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const modelMap: Record<number, string> = {
    1: '/models/bulbasaur.glb',
    2: '/models/ivysaur.glb',
    3: '/models/venusaur.glb',
    4: '/models/charmander.glb',
    5: '/models/charmeleon.glb',
    6: '/models/charizard.glb',
    25: '/models/pikachu.glb'
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuración de escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Configuración de cámara
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);

    // Configuración del renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.enablePan = true;
    controls.enableZoom = true;
    controlsRef.current = controls;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4a90e2, 0.5);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    const loader = new GLTFLoader();
    const modelPath = modelMap[pokemonId];

    if (!modelPath) {
      setError('Modelo no disponible para este Pokémon');
      setLoading(false);
      return;
    }

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.multiplyScalar(scale);
        
        model.position.sub(center.multiplyScalar(scale));
        
        scene.add(model);
        modelRef.current = model;

        // Configuración de animaciones existentes
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          
          //Reproductor de animaciones
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
          
          console.log(`Reproduciendo ${gltf.animations.length} animación(es)`);
        }
        
        setLoading(false);
      },
      (progress) => {
        console.log('Cargando:', (progress.loaded / progress.total * 100) + '%');
      },
      (err) => {
        console.error('Error cargando modelo:', err);
        setError('Error al cargar el modelo 3D');
        setLoading(false);
      }
    );

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Actualización de controles
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Actualización de animaciones del modelo
      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Manejo del resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [pokemonId]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Modelo 3D del Pokémon</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className={styles.viewerContainer}>
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Cargando modelo 3D...</p>
            </div>
          )}
          
          {error && (
            <div className={styles.errorContainer}>
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}
          
          <div ref={mountRef} className={styles.canvas} />
        </div>
        
        <div className={styles.footer}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Usa el mouse para rotar, zoom y mover la cámara.</span>
        </div>
      </div>
    </div>
  );
};