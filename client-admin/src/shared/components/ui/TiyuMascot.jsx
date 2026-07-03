// client-admin/src/shared/components/ui/TiyuMascot.jsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

let threeLoadPromise = null;
function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!threeLoadPromise) {
        threeLoadPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = THREE_CDN;
            script.async = true;
            script.onload = () => resolve(window.THREE);
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    return threeLoadPromise;
}

/**
 * Mascota 3D de Tiyú (Three.js) lista para usarse dentro de React.
 * Expone sayHello() vía ref para disparar el saludo desde donde lo necesites
 * (ej. justo cuando el usuario inicia sesión).
 *
 * Props:
 *  - size: tamaño en px del canvas (cuadrado)
 *  - greet: si es true, hace la animación de saludo automáticamente al montarse
 */
export const TiyuMascot = forwardRef(({ size = 110, greet = false, className = '' }, ref) => {
    const containerRef = useRef(null);
    const sayHelloFnRef = useRef(null);
    // Si alguien llama sayHello() ANTES de que la escena 3D termine de cargar
    // (typical al iniciar sesión, porque three.js viene de un CDN y tarda unos
    // cientos de ms), guardamos la intención aquí y la disparamos apenas esté lista.
    const pendingHelloRef = useRef(false);

    useImperativeHandle(ref, () => ({
        sayHello: () => {
            if (sayHelloFnRef.current) {
                sayHelloFnRef.current();
            } else {
                pendingHelloRef.current = true;
            }
        },
    }));

    useEffect(() => {
        let renderer, scene, camera, frameId;
        let tiyu, armRight, plant;
        let waveState = null;
        let disposed = false;
        const startTime = performance.now();

        loadThree().then((THREE) => {
            if (disposed || !containerRef.current) return;
            const container = containerRef.current;

            scene = new THREE.Scene();
            scene.background = null; // transparente, se integra con el fondo de la app

            camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
            // Cámara alejada y centrada más arriba para que entre TODO el cuerpo:
            // maceta + tierra + planta + brazos, sin recortar nada por arriba ni por abajo.
            camera.position.set(0, 1.25, 5.6);
            camera.lookAt(0, 1.25, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(size, size);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            container.innerHTML = '';
            container.appendChild(renderer.domElement);

            // ── Luces ──
            scene.add(new THREE.AmbientLight(0xffffff, 0.75));
            const keyLight = new THREE.DirectionalLight(0xfff2e0, 1.2);
            keyLight.position.set(2.5, 4.5, 4);
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.set(1024, 1024);
            scene.add(keyLight);
            const fillLight = new THREE.DirectionalLight(0xdce8ff, 0.35);
            fillLight.position.set(-4, 2, -1);
            scene.add(fillLight);

            // ── Sombra de piso (transparente) ──
            const ground = new THREE.Mesh(
                new THREE.PlaneGeometry(6, 6),
                new THREE.ShadowMaterial({ opacity: 0.14 })
            );
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.13;
            ground.receiveShadow = true;
            scene.add(ground);

            // ── Grupo Tiyú ──
            tiyu = new THREE.Group();
            tiyu.scale.set(0.82, 0.82, 0.82);
            scene.add(tiyu);

            // Cuerpo (maceta)
            const profilePts = [
                new THREE.Vector2(0.0, -0.90), new THREE.Vector2(0.55, -0.90),
                new THREE.Vector2(0.69, -0.82), new THREE.Vector2(0.84, -0.60),
                new THREE.Vector2(0.95, -0.33), new THREE.Vector2(1.02, -0.03),
                new THREE.Vector2(1.05, 0.21), new THREE.Vector2(1.04, 0.38),
                new THREE.Vector2(1.00, 0.51),
            ];
            const bodyGeo = new THREE.LatheGeometry(profilePts, 56);
            const posAttr = bodyGeo.attributes.position;
            const colorsArr = [];
            const baseColor = new THREE.Color(0xE08A47);
            const darkColor = new THREE.Color(0x9c5426);
            let minY = Infinity, maxY = -Infinity;
            for (let i = 0; i < posAttr.count; i++) { const y = posAttr.getY(i); if (y < minY) minY = y; if (y > maxY) maxY = y; }
            for (let i = 0; i < posAttr.count; i++) {
                const y = posAttr.getY(i);
                const t = THREE.MathUtils.mapLinear(y, minY, maxY, 0, 1);
                const shade = Math.min(1, t / 0.45);
                const c = darkColor.clone().lerp(baseColor, shade);
                colorsArr.push(c.r, c.g, c.b);
            }
            bodyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colorsArr, 3));
            const bodyMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.90;
            body.castShadow = true;
            body.receiveShadow = true;
            tiyu.add(body);

            const bodyTopY = body.position.y + 0.51;
            const bodyTopR = 1.00;

            const rimTorus = new THREE.Mesh(
                new THREE.TorusGeometry(bodyTopR + 0.02, 0.14, 20, 56),
                new THREE.MeshStandardMaterial({ color: 0xCB7C46, roughness: 0.82 })
            );
            rimTorus.rotation.x = Math.PI / 2;
            rimTorus.position.y = bodyTopY + 0.02;
            rimTorus.castShadow = true;
            tiyu.add(rimTorus);

            const soilRadius = bodyTopR - 0.08;
            const soilGeo = new THREE.CylinderGeometry(soilRadius, soilRadius * 0.95, 0.28, 40, 6);
            const soilPos = soilGeo.attributes.position;
            for (let i = 0; i < soilPos.count; i++) {
                const y = soilPos.getY(i);
                if (y > 0.02) {
                    const x = soilPos.getX(i); const z = soilPos.getZ(i);
                    const noise = (Math.sin(x * 14.1) * Math.cos(z * 11.3) * 0.025) + (Math.random() - 0.5) * 0.02;
                    soilPos.setY(i, y + noise + 0.04);
                }
            }
            soilGeo.computeVertexNormals();
            const soil = new THREE.Mesh(soilGeo, new THREE.MeshStandardMaterial({ color: 0x40301F, roughness: 0.95 }));
            soil.position.y = bodyTopY + 0.05;
            soil.castShadow = true;
            tiyu.add(soil);

            // ── Planta ──
            plant = new THREE.Group();
            plant.position.y = soil.position.y + 0.18;
            tiyu.add(plant);

            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.07, 0.55, 14),
                new THREE.MeshStandardMaterial({ color: 0x33691E, roughness: 0.65 })
            );
            stem.position.y = 0.27;
            stem.castShadow = true;
            plant.add(stem);

            function createLeafShape(width, length) {
                const s = new THREE.Shape();
                s.moveTo(0, 0);
                s.quadraticCurveTo(width, length * 0.18, width * 0.62, length * 0.72);
                s.quadraticCurveTo(width * 0.42, length * 0.96, 0, length);
                s.quadraticCurveTo(-width * 0.42, length * 0.96, -width * 0.62, length * 0.72);
                s.quadraticCurveTo(-width, length * 0.18, 0, 0);
                return s;
            }
            function makeLeaf(width, length, colorLight, colorDark, curveAmount) {
                const shape = createLeafShape(width, length);
                const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 20 });
                geo.translate(0, 0, -0.0175);
                const pos = geo.attributes.position;
                const cLight = new THREE.Color(colorLight);
                const cDark = new THREE.Color(colorDark);
                const cols = [];
                for (let i = 0; i < pos.count; i++) {
                    const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
                    const t = THREE.MathUtils.clamp(y / length, 0, 1);
                    const bend = Math.sin(t * Math.PI * 0.5) * curveAmount;
                    pos.setZ(i, z + bend * (1 - Math.abs(x) / (width + 0.001) * 0.3));
                    pos.setX(i, x * (1 - t * 0.06));
                    const c = cDark.clone().lerp(cLight, t);
                    cols.push(c.r, c.g, c.b);
                }
                geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
                geo.computeVertexNormals();
                const leaf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4 }));
                leaf.castShadow = true;
                return leaf;
            }

            [
                { angleY: -34, tiltX: -0.25, tiltZ: 0.18, w: 0.30, l: 0.95, curve: 0.55, light: 0x9CCC65, dark: 0x558B2F },
                { angleY: 4, tiltX: -0.10, tiltZ: -0.02, w: 0.32, l: 1.15, curve: 0.45, light: 0xAEDC7A, dark: 0x689F38 },
                { angleY: 36, tiltX: -0.22, tiltZ: -0.20, w: 0.30, l: 0.92, curve: 0.55, light: 0x9CCC65, dark: 0x558B2F },
            ].forEach((def) => {
                const leaf = makeLeaf(def.w, def.l, def.light, def.dark, def.curve);
                const group = new THREE.Group();
                group.add(leaf);
                group.position.set(0, 0.5, 0);
                group.rotation.y = THREE.MathUtils.degToRad(def.angleY);
                group.rotation.x = def.tiltX;
                group.rotation.z = def.tiltZ;
                plant.add(group);
            });

            [
                { angleY: -85, w: 0.13, l: 0.34, curve: 0.6, posY: 0.12 },
                { angleY: 100, w: 0.10, l: 0.24, curve: 0.6, posY: 0.08 },
            ].forEach((def) => {
                const leaf = makeLeaf(def.w, def.l, 0xAEDC7A, 0x689F38, def.curve);
                const group = new THREE.Group();
                group.add(leaf);
                group.position.set(0, def.posY, 0);
                group.rotation.y = THREE.MathUtils.degToRad(def.angleY);
                group.rotation.x = -0.55;
                plant.add(group);
            });

            // ── Cara ──
            const face = new THREE.Group();
            const faceY = body.position.y + 0.13;
            const faceZ = 1.00;
            face.position.set(0, faceY, 0);
            tiyu.add(face);

            function makeEye(x) {
                const eyeGroup = new THREE.Group();
                const eye = new THREE.Mesh(new THREE.SphereGeometry(0.135, 32, 32), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.25, metalness: 0.15 }));
                eye.scale.set(1, 1.08, 0.75);
                eyeGroup.add(eye);
                const glint = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, emissive: 0x222222 }));
                glint.position.set(-0.05, 0.055, 0.09);
                eyeGroup.add(glint);
                eyeGroup.position.set(x, 0, faceZ * 0.98);
                return eyeGroup;
            }
            face.add(makeEye(-0.29));
            face.add(makeEye(0.29));

            const mouth = new THREE.Mesh(
                new THREE.TorusGeometry(0.145, 0.021, 12, 32, Math.PI * 0.62),
                new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.6 })
            );
            mouth.position.set(0, -0.18, faceZ * 0.97);
            mouth.rotation.z = Math.PI + (Math.PI - Math.PI * 0.62) / 2;
            mouth.rotation.x = 0.05;
            face.add(mouth);

            // ── Extremidades ──
            function makeLimb(rootR, tipR, length, color) {
                const group = new THREE.Group();
                const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.82 });
                const rootSphere = new THREE.Mesh(new THREE.SphereGeometry(rootR, 20, 16), mat);
                rootSphere.castShadow = true;
                group.add(rootSphere);
                const frustHeight = Math.max(length - tipR, 0.001);
                const frust = new THREE.Mesh(new THREE.CylinderGeometry(rootR, tipR, frustHeight, 22, 1), mat);
                frust.position.y = -frustHeight / 2;
                frust.castShadow = true;
                group.add(frust);
                const tipSphere = new THREE.Mesh(new THREE.SphereGeometry(tipR, 20, 16), mat);
                tipSphere.position.y = -(length - tipR);
                tipSphere.castShadow = true;
                group.add(tipSphere);
                return group;
            }

            const limbColor = 0xE08A47;
            function makeArm(side) {
                const shoulder = new THREE.Group();
                const shoulderY = body.position.y + 0.02;
                shoulder.position.set(side * 1.00 * 0.80, shoulderY, 0.34);
                const limb = makeLimb(0.175, 0.20, 0.64, limbColor);
                limb.rotation.z = side * Math.PI / 2;
                shoulder.add(limb);
                shoulder.rotation.z = side * -0.32;
                shoulder.rotation.x = -0.24;
                return shoulder;
            }
            armRight = makeArm(1);
            tiyu.add(makeArm(-1));
            tiyu.add(armRight);

            function makeLeg(x) {
                const hip = new THREE.Group();
                hip.position.set(x, body.position.y - 0.62, 0.18);
                hip.add(makeLimb(0.17, 0.19, 0.46, limbColor));
                hip.rotation.x = 0.03;
                return hip;
            }
            tiyu.add(makeLeg(-0.34));
            tiyu.add(makeLeg(0.34));

            // ── Animación de saludo (evento de login) ──
            const ARM_REST_Z = -0.32, ARM_REST_X = -0.24;
            const ARM_LIFT_Z = 0.38, ARM_LIFT_X = -0.30;
            const BODY_TILT_Z = 0.11, BODY_TILT_X = -0.06, BODY_TURN_Y = -0.07;

            function updateWave(t) {
                if (!waveState) return;
                const elapsed = t - waveState.startTime;
                const p = elapsed / waveState.duration;
                if (p >= 1) {
                    armRight.rotation.z = ARM_REST_Z;
                    armRight.rotation.x = ARM_REST_X;
                    tiyu.rotation.set(0, 0, 0);
                    waveState = null;
                    return;
                }
                const raise = Math.min(p / 0.25, 1);
                const raiseEase = 1 - Math.pow(1 - raise, 3);
                const liftedZ = THREE.MathUtils.lerp(ARM_REST_Z, ARM_LIFT_Z, raiseEase);
                const liftedX = THREE.MathUtils.lerp(ARM_REST_X, ARM_LIFT_X, raiseEase);
                let wag = 0;
                if (p > 0.2 && p < 0.85) wag = Math.sin((p - 0.2) * Math.PI * 7) * 0.12;
                const lower = p > 0.85 ? THREE.MathUtils.smoothstep((p - 0.85) / 0.15, 0, 1) : 0;
                armRight.rotation.z = THREE.MathUtils.lerp(liftedZ + wag, ARM_REST_Z, lower);
                armRight.rotation.x = THREE.MathUtils.lerp(liftedX, ARM_REST_X, lower);
                const tiltZ = THREE.MathUtils.lerp(0, BODY_TILT_Z, raiseEase) + wag * 0.05;
                const tiltX = THREE.MathUtils.lerp(0, BODY_TILT_X, raiseEase);
                const turnY = THREE.MathUtils.lerp(0, BODY_TURN_Y, raiseEase);
                tiyu.rotation.z = THREE.MathUtils.lerp(tiltZ, 0, lower);
                tiyu.rotation.x = THREE.MathUtils.lerp(tiltX, 0, lower);
                tiyu.rotation.y = THREE.MathUtils.lerp(turnY, 0, lower);
            }

            sayHelloFnRef.current = () => {
                waveState = { startTime: (performance.now() - startTime) / 1000, duration: 2.0 };
            };

            // Si nos pidieron saludar mientras la escena todavía cargaba, lo hacemos ahora.
            if (pendingHelloRef.current) {
                pendingHelloRef.current = false;
                sayHelloFnRef.current();
            } else if (greet) {
                setTimeout(() => sayHelloFnRef.current?.(), 500);
            }

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                const t = (performance.now() - startTime) / 1000;
                tiyu.position.y = Math.sin(t * 1.2) * 0.03;
                plant.rotation.z = Math.sin(t * 0.8) * 0.015;
                updateWave(t);
                renderer.render(scene, camera);
            };
            animate();
        });

        return () => {
            disposed = true;
            if (frameId) cancelAnimationFrame(frameId);
            if (renderer) {
                renderer.dispose();
                renderer.domElement.remove();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ width: size, height: size, flexShrink: 0 }}
        />
    );
});

TiyuMascot.displayName = 'TiyuMascot';