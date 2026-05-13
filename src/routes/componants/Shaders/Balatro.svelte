<script lang="ts">
  import { Renderer, Program, Mesh, Triangle } from 'ogl';
  import { onMount } from 'svelte';

  interface Props {
    // Balatro Props
    spinRotation?: number;
    spinSpeed?: number;
    offset?: [number, number];
    color1?: string;
    color2?: string;
    color3?: string;
    contrast?: number;
    lighting?: number;
    spinAmount?: number;
    pixelFilter?: number;
    spinEase?: number;
    isRotate?: boolean;
    mouseInteraction?: boolean;
    opacity?: number;
    blur?: number;
    noise?: number;
    // Silk Props
    silkSpeed?: number;
    silkScale?: number;
    silkIntensity?: number;
  }

  let {
    spinRotation = -.50,
    spinSpeed = 2,
    offset = [0.0, 0.0],
    color1 = '#7C3AED',
    color2 = '#A855F7',
    color3 = '#2a044d',
    contrast = 3.0,
    lighting = 0.65,
    spinAmount = 0,
    pixelFilter = 700.0,
    spinEase = 1.0,
    isRotate = false,
    mouseInteraction = false,
    opacity = .4,
    blur = 0.0,
    noise = 0.4,
    silkSpeed = 2.0,
    silkScale = 1.0,
    silkIntensity = 0.5
  }: Props = $props();

  let container: HTMLDivElement;
  let program: Program;

  function hexToVec4(hex: string): [number, number, number, number] {
    let hexStr = hex.replace('#', '');
    let r = 0, g = 0, b = 0, a = 1;
    if (hexStr.length === 6) {
      r = parseInt(hexStr.slice(0, 2), 16) / 255;
      g = parseInt(hexStr.slice(2, 4), 16) / 255;
      b = parseInt(hexStr.slice(4, 6), 16) / 255;
    } else if (hexStr.length === 8) {
      r = parseInt(hexStr.slice(0, 2), 16) / 255;
      g = parseInt(hexStr.slice(2, 4), 16) / 255;
      b = parseInt(hexStr.slice(4, 6), 16) / 255;
      a = parseInt(hexStr.slice(6, 8), 16) / 255;
    }
    return [r, g, b, a];
  }

  const vertexShader = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
  `;

  const fragmentShader = `
    precision highp float;
    #define PI 3.14159265359
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float uSpinRotation;
    uniform float uSpinSpeed;
    uniform vec2 uOffset;
    uniform vec4 uColor1;
    uniform vec4 uColor2;
    uniform vec4 uColor3;
    uniform float uContrast;
    uniform float uLighting;
    uniform float uSpinAmount;
    uniform float uPixelFilter;
    uniform float uSpinEase;
    uniform bool uIsRotate;
    uniform vec2 uMouse;
    uniform float uOpacity;
    uniform float uBlur;
    uniform float uNoise;
    uniform float uSilkSpeed;
    uniform float uSilkScale;
    uniform float uSilkIntensity;
    varying vec2 vUv;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    vec4 getBalatroColor(vec2 screenSize, vec2 screen_coords) {
        float pixel_size = length(screenSize.xy) / uPixelFilter;
        vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;
        float uv_len = length(uv);
        float speed = (uSpinRotation * uSpinEase * 0.2);
        if(uIsRotate){
           speed = iTime * speed;
        }
        speed += 302.2;
        float mouseInfluence = (uMouse.x * 2.0 - 1.0);
        speed += mouseInfluence * 0.1;
        float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
        vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
        uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
        uv *= 30.0;
        float baseSpeed = iTime * uSpinSpeed;
        speed = baseSpeed + mouseInfluence * 2.0;
        vec2 uv2 = vec2(uv.x + uv.y);
        for(int i = 0; i < 5; i++) {
            uv2 += sin(max(uv.x, uv.y)) + uv;
            uv += 0.5 * vec2(
                cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
                sin(uv2.x - 0.113 * speed)
            );
            uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
        }
        float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
        float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
        float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
        float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
        float c3p = 1.0 - min(1.0, c1p + c2p);
        float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);
        vec4 res = (0.3 / uContrast) * uColor1 + (1.0 - 0.3 / uContrast) * (uColor1 * c1p + uColor2 * c2p + vec4(c3p * uColor3.rgb, c3p * uColor1.a)) + light;
        return vec4(res.rgb, res.a * uOpacity);
    }

    vec4 getColor(vec2 screenCoords) {
        vec4 col = getBalatroColor(iResolution.xy, screenCoords);
        vec2 localUv = screenCoords / iResolution.xy;
        
        // Silk Modulation
        vec2 silkUv = localUv * uSilkScale * 2.0;
        float tOffsetSilk = uSilkSpeed * iTime * 0.5;
        silkUv.y += 0.03 * sin(8.0 * silkUv.x - tOffsetSilk);
        float silkPattern = 0.6 + 0.4 * sin(5.0 * (silkUv.x + silkUv.y + cos(3.0 * silkUv.x + 5.0 * silkUv.y) + 0.02 * tOffsetSilk) + sin(20.0 * (silkUv.x + silkUv.y - 0.1 * tOffsetSilk)));
        
        col.rgb = mix(col.rgb, col.rgb * silkPattern, uSilkIntensity);
        return col;
    }

    void main() {
        vec2 uvCoords = vUv * iResolution.xy;
        vec4 col = vec4(0.0);
        
        if (uBlur > 0.0) {
            float d = uBlur * 2.0;
            // 9-tap Gaussian Blur
            col += getColor(uvCoords + vec2(-d, -d)) * 0.0625;
            col += getColor(uvCoords + vec2(0.0, -d)) * 0.125;
            col += getColor(uvCoords + vec2(d, -d)) * 0.0625;
            col += getColor(uvCoords + vec2(-d, 0.0)) * 0.125;
            col += getColor(uvCoords) * 0.25;
            col += getColor(uvCoords + vec2(d, 0.0)) * 0.125;
            col += getColor(uvCoords + vec2(-d, d)) * 0.0625;
            col += getColor(uvCoords + vec2(0.0, d)) * 0.125;
            col += getColor(uvCoords + vec2(d, d)) * 0.0625;
        } else {
            col = getColor(uvCoords);
        }

        if (uNoise > 0.0) {
            float n = (hash(floor(vUv * iResolution.xy)) - 0.5) * uNoise;
            col.rgb += n;
        }
        
        gl_FragColor = col;
    }
  `;

  onMount(() => {
    if (!container) return;
    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      if (program) {
        program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
      }
    }
    window.addEventListener('resize', resize);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]
        },
        uSpinRotation: { value: spinRotation },
        uSpinSpeed: { value: spinSpeed },
        uOffset: { value: offset },
        uColor1: { value: hexToVec4(color1) },
        uColor2: { value: hexToVec4(color2) },
        uColor3: { value: hexToVec4(color3) },
        uContrast: { value: contrast },
        uLighting: { value: lighting },
        uSpinAmount: { value: spinAmount },
        uPixelFilter: { value: pixelFilter },
        uSpinEase: { value: spinEase },
        uIsRotate: { value: isRotate },
        uMouse: { value: [0.5, 0.5] },
        uOpacity: { value: opacity },
        uBlur: { value: blur },
        uNoise: { value: noise },
        uSilkSpeed: { value: silkSpeed },
        uSilkScale: { value: silkScale },
        uSilkIntensity: { value: silkIntensity }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animationFrameId: number;

    function update(time: number) {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.iTime.value = time * 0.001;
      renderer.render({ scene: mesh });
    }
    animationFrameId = requestAnimationFrame(update);
    container.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      if (!mouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      program.uniforms.uMouse.value = [x, y];
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  });

  $effect(() => {
    if (program) {
      program.uniforms.uSpinRotation.value = spinRotation;
      program.uniforms.uSpinSpeed.value = spinSpeed;
      program.uniforms.uOffset.value = offset;
      program.uniforms.uColor1.value = hexToVec4(color1);
      program.uniforms.uColor2.value = hexToVec4(color2);
      program.uniforms.uColor3.value = hexToVec4(color3);
      program.uniforms.uContrast.value = contrast;
      program.uniforms.uLighting.value = lighting;
      program.uniforms.uSpinAmount.value = spinAmount;
      program.uniforms.uPixelFilter.value = pixelFilter;
      program.uniforms.uSpinEase.value = spinEase;
      program.uniforms.uIsRotate.value = isRotate;
      program.uniforms.uOpacity.value = opacity;
      program.uniforms.uBlur.value = blur;
      program.uniforms.uNoise.value = noise;
      program.uniforms.uSilkSpeed.value = silkSpeed;
      program.uniforms.uSilkScale.value = silkScale;
      program.uniforms.uSilkIntensity.value = silkIntensity;
    }
  });
</script>

<div bind:this={container} class="balatro-container"></div>

<style>
  .balatro-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    pointer-events: none;
  }

  :global(.balatro-container canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
</style>
