import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const COLORS = {
  hot: '#FFD9C2',
  ember: '#FF3B4E',
  violet: '#8B5CF6',
  cyan: '#38BDF8',
}

const PARTICLE_COUNT = 2400
const DISK_INNER = 1.04
const DISK_OUTER = 3.05
const BASE_TILT = 0.98
const BASE_ROLL = -0.18
const YAW_LIMIT = 0.7
const PITCH_LIMIT = 0.3

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function useGlowTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    if (context) {
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
      gradient.addColorStop(0.32, 'rgba(255,255,255,0.26)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, 256, 256)
    }
    const next = new THREE.CanvasTexture(canvas)
    next.colorSpace = THREE.SRGBColorSpace
    return next
  }, [])

  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function createDisk() {
  const random = createRandom(4127)
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)
  const twinkles = new Float32Array(PARTICLE_COUNT)
  const radius = new Float32Array(PARTICLE_COUNT)
  const angle = new Float32Array(PARTICLE_COUNT)
  const height = new Float32Array(PARTICLE_COUNT)
  const speed = new Float32Array(PARTICLE_COUNT)

  const hot = new THREE.Color(COLORS.hot)
  const ember = new THREE.Color(COLORS.ember)
  const violet = new THREE.Color(COLORS.violet)
  const cyan = new THREE.Color(COLORS.cyan)
  const color = new THREE.Color()

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const t = Math.pow(random(), 1.5)
    const r = DISK_INNER + t * (DISK_OUTER - DISK_INNER)
    const a = random() * Math.PI * 2
    const z = (random() - 0.5) * (0.05 + (r / DISK_OUTER) * 0.16)
    const spark = random()

    radius[index] = r
    angle[index] = a
    height[index] = z
    positions[index * 3] = Math.cos(a) * r
    positions[index * 3 + 1] = Math.sin(a) * r
    positions[index * 3 + 2] = z

    if (t < 0.4) color.lerpColors(hot, ember, t / 0.4)
    else if (t < 0.8) color.lerpColors(ember, violet, (t - 0.4) / 0.4)
    else color.lerpColors(violet, cyan, (t - 0.8) / 0.2)
    if (spark > 0.986) color.set(COLORS.hot)
    color.multiplyScalar((0.58 + (1 - t) * 0.52 + spark * 0.16) * (t > 0.8 ? 0.68 : 1))

    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
    sizes[index] =
      0.03 + random() * 0.052 + (1 - t) * 0.018 + (spark > 0.986 ? 0.038 : 0)
    twinkles[index] = random()
    speed[index] = (0.26 + 0.52 * Math.pow(DISK_INNER / r, 1.25)) * (0.8 + random() * 0.45)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1))

  return { geometry, radius, angle, height, speed }
}

const POINTS_VERTEX = `
  uniform float uScale;
  uniform float uTime;
  uniform float uBoost;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aTwinkle;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float twinkle = 0.72 + 0.28 * sin(uTime * (0.9 + aTwinkle * 2.6) + aTwinkle * 61.0);
    gl_PointSize = aSize * uScale * (1.0 + uBoost * 0.28) / max(-mvPosition.z, 0.1);
    vColor = aColor;
    vAlpha = twinkle * (1.0 + uBoost * 0.65);
  }
`

const POINTS_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float core = smoothstep(0.5, 0.02, distanceToCenter);
    float glow = smoothstep(0.5, 0.15, distanceToCenter);
    float alpha = (core * 0.78 + glow * 0.32) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const RIM_VERTEX = `
  varying vec3 vNormalView;
  varying vec3 vViewDirection;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormalView = normalize(normalMatrix * normal);
    vViewDirection = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const RIM_FRAGMENT = `
  uniform vec3 uColor;
  uniform float uPulse;
  varying vec3 vNormalView;
  varying vec3 vViewDirection;

  void main() {
    float rim = pow(1.0 - clamp(dot(normalize(vNormalView), normalize(vViewDirection)), 0.0, 1.0), 2.35);
    float intensity = (0.16 + rim * 2.4) * (1.0 + uPulse * 1.35);
    gl_FragColor = vec4(uColor * intensity, rim * 0.9 * (1.0 + uPulse));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function createStars() {
  const count = 440
  const random = createRandom(9081)
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const radius = 5.5 + random() * 6.5
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.cos(phi)
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.6
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geometry
}

function Starfield({ animated }: { animated: boolean }) {
  const points = useRef<THREE.Points>(null)
  const geometry = useMemo(createStars, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    if (!animated || !points.current) return
    const time = state.clock.getElapsedTime()
    points.current.rotation.z = time * 0.008
    points.current.rotation.y = Math.sin(time * 0.04) * 0.08
  })

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.018}
        color="#948AC9"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

function StudioEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const target = generator.fromScene(room, 0.04)
    scene.environment = target.texture
    room.dispose()
    generator.dispose()

    return () => {
      scene.environment = null
      target.dispose()
    }
  }, [gl, scene])

  return null
}

function EmberCore({ animated }: { animated: boolean }) {
  const { gl } = useThree()
  const root = useRef<THREE.Group>(null)
  const parallax = useRef<THREE.Group>(null)
  const pivot = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const satelliteA = useRef<THREE.Group>(null)
  const satelliteB = useRef<THREE.Group>(null)
  const waveA = useRef<THREE.Mesh>(null)
  const waveB = useRef<THREE.Mesh>(null)
  const waveAMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const waveBMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const glowTexture = useGlowTexture()

  const disk = useMemo(createDisk, [])
  const diskMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: POINTS_VERTEX,
        fragmentShader: POINTS_FRAGMENT,
        uniforms: {
          uScale: { value: 420 },
          uTime: { value: 0 },
          uBoost: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  const rimUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(COLORS.ember) },
      uPulse: { value: 0 },
    }),
    [],
  )

  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: rimUniforms,
        vertexShader: RIM_VERTEX,
        fragmentShader: RIM_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [rimUniforms],
  )

  const drag = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0,
    yawVelocity: 0,
    pitchVelocity: 0,
  })
  const pulse = useRef({ at: -10, requested: false })

  useEffect(
    () => () => {
      disk.geometry.dispose()
      diskMaterial.dispose()
      rimMaterial.dispose()
    },
    [disk, diskMaterial, rimMaterial],
  )

  useEffect(() => {
    if (!animated) return
    const canvas = gl.domElement
    const state = drag.current
    canvas.style.touchAction = 'pan-y'

    const handleDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.button !== 0) return
      state.active = true
      state.lastX = event.clientX
      state.lastY = event.clientY
      state.yawVelocity = 0
      state.pitchVelocity = 0
      pulse.current.requested = true
      canvas.setPointerCapture(event.pointerId)
      document.documentElement.classList.add('is-dragging-core')
    }

    const handleMove = (event: PointerEvent) => {
      if (!state.active) return
      const deltaX = event.clientX - state.lastX
      const deltaY = event.clientY - state.lastY
      state.lastX = event.clientX
      state.lastY = event.clientY
      state.yaw = THREE.MathUtils.clamp(state.yaw + deltaX * 0.0062, -YAW_LIMIT, YAW_LIMIT)
      state.pitch = THREE.MathUtils.clamp(state.pitch + deltaY * 0.0038, -PITCH_LIMIT, PITCH_LIMIT)
      state.yawVelocity = deltaX * 0.0013
      state.pitchVelocity = deltaY * 0.0008
    }

    const handleUp = (event: PointerEvent) => {
      if (!state.active) return
      state.active = false
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      document.documentElement.classList.remove('is-dragging-core')
    }

    canvas.addEventListener('pointerdown', handleDown)
    canvas.addEventListener('pointermove', handleMove)
    canvas.addEventListener('pointerup', handleUp)
    canvas.addEventListener('pointercancel', handleUp)

    return () => {
      canvas.removeEventListener('pointerdown', handleDown)
      canvas.removeEventListener('pointermove', handleMove)
      canvas.removeEventListener('pointerup', handleUp)
      canvas.removeEventListener('pointercancel', handleUp)
      document.documentElement.classList.remove('is-dragging-core')
    }
  }, [animated, gl])

  useFrame((state, frameDelta) => {
    const time = state.clock.getElapsedTime()
    const delta = Math.min(frameDelta, 0.05)
    const dragState = drag.current

    if (animated) {
      if (pulse.current.requested) {
        pulse.current.requested = false
        pulse.current.at = time
      }

      if (!dragState.active) {
        const inertia = delta * 60
        dragState.yaw = THREE.MathUtils.clamp(
          dragState.yaw + dragState.yawVelocity * inertia,
          -YAW_LIMIT,
          YAW_LIMIT,
        )
        dragState.pitch = THREE.MathUtils.clamp(
          dragState.pitch + dragState.pitchVelocity * inertia,
          -PITCH_LIMIT,
          PITCH_LIMIT,
        )
        dragState.yawVelocity *= Math.pow(0.9, inertia)
        dragState.pitchVelocity *= Math.pow(0.86, inertia)
      }

      if (pivot.current) {
        const targetX = BASE_TILT + dragState.pitch + Math.sin(time * 0.33) * 0.035
        const targetY = dragState.yaw + Math.sin(time * 0.24) * 0.12
        const ease = Math.min(1, delta * 7)
        pivot.current.rotation.x += (targetX - pivot.current.rotation.x) * ease
        pivot.current.rotation.y += (targetY - pivot.current.rotation.y) * ease
      }

      if (parallax.current) {
        const ease = Math.min(1, delta * 3)
        parallax.current.rotation.y += (state.pointer.x * 0.08 - parallax.current.rotation.y) * ease
        parallax.current.rotation.x += (-state.pointer.y * 0.05 - parallax.current.rotation.x) * ease
      }

      if (satelliteA.current) satelliteA.current.rotation.z = time * 0.34
      if (satelliteB.current) satelliteB.current.rotation.z = -time * 0.23
    }

    diskMaterial.uniforms.uTime.value = time
    diskMaterial.uniforms.uScale.value = state.size.height * state.viewport.dpr * 0.5
    const spinBoost = dragState.active ? 1.5 : 1
    const positionAttribute = disk.geometry.getAttribute('position') as THREE.BufferAttribute
    const positions = positionAttribute.array as Float32Array

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const currentAngle = disk.angle[index] + time * disk.speed[index] * spinBoost
      const currentRadius = disk.radius[index] + Math.sin(time * 0.6 + index) * 0.012
      positions[index * 3] = Math.cos(currentAngle) * currentRadius
      positions[index * 3 + 1] = Math.sin(currentAngle) * currentRadius
      positions[index * 3 + 2] =
        disk.height[index] + Math.sin(currentAngle * 2.3 + index * 0.7) * 0.015
    }
    positionAttribute.needsUpdate = true

    const age = time - pulse.current.at
    const pulseStrength = age >= 0 ? Math.max(0, 1 - age / 0.65) : 0
    rimUniforms.uPulse.value = pulseStrength
    diskMaterial.uniforms.uBoost.value = age >= 0 ? Math.max(0, 1 - age / 0.8) : 0

    if (core.current) {
      const bump = age >= 0 && age < 0.6 ? 1 + Math.sin((age / 0.6) * Math.PI) * 0.07 : 1
      core.current.scale.setScalar(bump)
    }

    const firstWave = age >= 0 ? Math.min(age / 1.15, 1) : 1
    if (waveA.current) waveA.current.scale.setScalar(0.86 + firstWave * 2.9)
    if (waveAMaterial.current) {
      waveAMaterial.current.opacity = age >= 0 && firstWave < 1 ? Math.pow(1 - firstWave, 2) * 0.82 : 0
    }

    const secondAge = age - 0.14
    const secondWave = secondAge >= 0 ? Math.min(secondAge / 1.05, 1) : 1
    if (waveB.current) waveB.current.scale.setScalar(0.8 + secondWave * 2.3)
    if (waveBMaterial.current) {
      waveBMaterial.current.opacity =
        secondAge >= 0 && secondWave < 1 ? Math.pow(1 - secondWave, 2) * 0.55 : 0
    }

    if (root.current) {
      const scroll =
        typeof window === 'undefined'
          ? 0
          : Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2)
      root.current.position.y = 0.82 + Math.sin(time * 0.42) * 0.045 - scroll * 0.42
      root.current.position.x = 0.5 + Math.sin(time * 0.3) * 0.02
    }
  })

  return (
    <group ref={root} position={[0.5, 0.82, 0]} scale={0.82}>
      <Starfield animated={animated} />

      <sprite position={[0.2, -0.15, -2.3]} scale={[7.4, 7.4, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={COLORS.ember}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[0, 0, -1.8]} scale={[7.8, 1.9, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={COLORS.ember}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[-2.3, 1.7, -2.8]} scale={[4.6, 4.6, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={COLORS.violet}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[2.4, -1.6, -2.2]} scale={[3.8, 3.8, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={COLORS.cyan}
          transparent
          opacity={0.13}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <group ref={parallax}>
        <group ref={pivot} rotation={[BASE_TILT, 0, BASE_ROLL]}>
          <mesh ref={core} renderOrder={2}>
            <icosahedronGeometry args={[0.78, 1]} />
            <meshPhysicalMaterial
              color="#171220"
              metalness={0.95}
              roughness={0.16}
              clearcoat={1}
              clearcoatRoughness={0.12}
              iridescence={0.9}
              iridescenceIOR={1.5}
              envMapIntensity={1.3}
              emissive={COLORS.ember}
              emissiveIntensity={0.06}
              flatShading
            />
          </mesh>
          <mesh scale={1.035} renderOrder={3} material={rimMaterial}>
            <icosahedronGeometry args={[0.78, 2]} />
          </mesh>
          <sprite position={[0, 0, 0.4]} scale={[3.2, 3.2, 1]} renderOrder={4}>
            <spriteMaterial
              map={glowTexture}
              color={COLORS.ember}
              transparent
              opacity={0.26}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>

          <mesh renderOrder={4}>
            <torusGeometry args={[0.94, 0.0038, 8, 200]} />
            <meshBasicMaterial
              color={COLORS.ember}
              transparent
              opacity={0.85}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[0, 0, 0.42]} renderOrder={4}>
            <torusGeometry args={[1.08, 0.0018, 6, 200]} />
            <meshBasicMaterial
              color={COLORS.hot}
              transparent
              opacity={0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          <points geometry={disk.geometry} material={diskMaterial} frustumCulled={false} renderOrder={1} />

          <mesh ref={waveA} position={[0, 0, 0.02]} renderOrder={5}>
            <ringGeometry args={[0.93, 1, 160]} />
            <meshBasicMaterial
              ref={waveAMaterial}
              color={COLORS.ember}
              transparent
              opacity={0}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh ref={waveB} position={[0, 0, 0.01]} renderOrder={5}>
            <ringGeometry args={[0.96, 1, 160]} />
            <meshBasicMaterial
              ref={waveBMaterial}
              color={COLORS.violet}
              transparent
              opacity={0}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          <group rotation={[0.52, 0.18, 0.12]}>
            <mesh>
              <torusGeometry args={[2.55, 0.0032, 8, 280]} />
              <meshBasicMaterial
                color={COLORS.cyan}
                transparent
                opacity={0.28}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <group ref={satelliteA}>
              <mesh position={[2.55, 0, 0]}>
                <sphereGeometry args={[0.028, 12, 12]} />
                <meshBasicMaterial color={COLORS.cyan} />
              </mesh>
              <sprite position={[2.55, 0, 0]} scale={[0.62, 0.62, 1]}>
                <spriteMaterial
                  map={glowTexture}
                  color={COLORS.cyan}
                  transparent
                  opacity={0.7}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </sprite>
            </group>
          </group>

          <group rotation={[-0.38, 0.52, 0.34]}>
            <mesh>
              <torusGeometry args={[2.2, 0.003, 8, 260]} />
              <meshBasicMaterial
                color={COLORS.ember}
                transparent
                opacity={0.34}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <group ref={satelliteB}>
              <mesh position={[2.2, 0, 0]}>
                <sphereGeometry args={[0.032, 12, 12]} />
                <meshBasicMaterial color={COLORS.ember} />
              </mesh>
              <sprite position={[2.2, 0, 0]} scale={[0.78, 0.78, 1]}>
                <spriteMaterial
                  map={glowTexture}
                  color={COLORS.ember}
                  transparent
                  opacity={0.75}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </sprite>
            </group>
          </group>

          <group rotation={[0.05, -0.42, -0.28]}>
            <mesh>
              <torusGeometry args={[2.8, 0.0022, 6, 280]} />
              <meshBasicMaterial
                color={COLORS.violet}
                transparent
                opacity={0.2}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

function CameraRig({ animated }: { animated: boolean }) {
  useFrame((state) => {
    if (!animated) return
    const camera = state.camera
    camera.position.x += (state.pointer.x * 0.16 - camera.position.x) * 0.025
    camera.position.y += (state.pointer.y * 0.1 - camera.position.y) * 0.025
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene({ animated }: { animated: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.3], fov: 43 }}
      dpr={[1, 1.7]}
      frameloop={animated ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4.5, 5.5, 7]} intensity={2.6} color="#ffffff" />
      <pointLight position={[-4, 2.5, 4]} intensity={24} distance={12} color={COLORS.violet} />
      <pointLight position={[3.5, -1.5, 4.5]} intensity={32} distance={11} color={COLORS.ember} />
      <pointLight position={[-2, -3.5, 2.5]} intensity={15} distance={10} color={COLORS.cyan} />
      <StudioEnvironment />
      <EmberCore animated={animated} />
      <CameraRig animated={animated} />
    </Canvas>
  )
}
