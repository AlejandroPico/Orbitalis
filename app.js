(() => {
  "use strict";
  const TAU = Math.PI * 2,
    VIS_R = 5,
    MAX_TRACK = 720,
    Y = new THREE.Vector3(0, 1, 0),
    $ = (id) => document.getElementById(id),
    rad = (d) => (d * Math.PI) / 180,
    deg = (r) => (r * 180) / Math.PI,
    clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
    wrap = (a) => ((a % TAU) + TAU) % TAU;
  const BASE =
      "https://raw.githubusercontent.com/AlejandroPico/Orbitalis/main/assets/",
    LC = "https://raw.githubusercontent.com/louh/lcars/main/public/planets/",
    TX =
      "https://raw.githubusercontent.com/ofrohn/threex.planets/master/images/maps/";
  const BODIES = {
    mercury: {
      name: "Mercurio",
      type: "PLANETA TERRESTRE",
      family: "Planetas",
      r: 2439.7,
      polar: 2439.7,
      mu: 22032.08,
      rot: 5067030,
      alt: 400,
      color: LC + "2k_mercury.jpg",
      height: TX + "mercurybump.jpg",
      note: "Relieve: mosaico y elevación derivados de MESSENGER/USGS.",
      atmo: 0,
      glow: 0x9ba4a7,
    },
    venus: {
      name: "Venus",
      type: "PLANETA TERRESTRE",
      family: "Planetas",
      r: 6051.8,
      polar: 6051.8,
      mu: 324858.6,
      rot: -20996760,
      alt: 500,
      color: LC + "2k_venus_surface.jpg",
      height: LC + "2k_venus_surface.jpg",
      clouds: LC + "2k_venus_atmosphere.jpg",
      note: "Superficie de radar; relieve visual derivado de la cartografía Magellan.",
      atmo: 0.72,
      glow: 0xffb56d,
    },
    earth: {
      name: "Tierra",
      type: "PLANETA TERRESTRE",
      family: "Planetas",
      r: 6378.137,
      polar: 6356.752,
      mu: 398600.4418,
      rot: 86164.09,
      alt: 700,
      color: BASE + "earth-blue-marble.jpg",
      height: BASE + "earth-topology.png",
      specular: BASE + "earth-water.png",
      clouds: BASE + "clouds.png",
      night: BASE + "earth-night.jpg",
      note: "Topografía global, Blue Marble, nubes, océanos y luces nocturnas.",
      atmo: 0.48,
      glow: 0x49c9ff,
    },
    moon: {
      name: "Luna",
      type: "SATÉLITE ROCOSO",
      family: "Sistema Tierra-Luna",
      r: 1737.4,
      polar: 1735.97,
      mu: 4902.8,
      rot: 2360591,
      alt: 100,
      color: LC + "2k_moon.jpg",
      height: TX + "moonbump.jpg",
      note: "Relieve lunar cartografiado mediante misiones orbitales.",
      atmo: 0,
      glow: 0xaeb9c2,
    },
    mars: {
      name: "Marte",
      type: "PLANETA TERRESTRE",
      family: "Planetas",
      r: 3396.2,
      polar: 3376.2,
      mu: 42828.37,
      rot: 88642.7,
      alt: 400,
      color: LC + "2k_mars.jpg",
      height: TX + "marsbump.jpg",
      note: "Mosaico global y altimetría basada en cartografía marciana.",
      atmo: 0.22,
      glow: 0xff704f,
    },
    jupiter: {
      name: "Júpiter",
      type: "GIGANTE GASEOSO",
      family: "Planetas",
      r: 71492,
      polar: 66854,
      mu: 126686534,
      rot: 35730,
      alt: 6000,
      color: LC + "2k_jupiter.jpg",
      note: "No existe superficie sólida: se cartografía estructura nubosa.",
      atmo: 0.2,
      glow: 0xffc591,
      gas: true,
    },
    saturn: {
      name: "Saturno",
      type: "GIGANTE GASEOSO",
      family: "Planetas",
      r: 60268,
      polar: 54364,
      mu: 37931187,
      rot: 38362,
      alt: 6000,
      color: LC + "2k_saturn.jpg",
      ring: true,
      note: "No existe superficie sólida: se cartografía estructura nubosa.",
      atmo: 0.18,
      glow: 0xffd7a2,
      gas: true,
    },
    uranus: {
      name: "Urano",
      type: "GIGANTE DE HIELO",
      family: "Planetas",
      r: 25559,
      polar: 24973,
      mu: 5793939,
      rot: -62064,
      alt: 3500,
      color: LC + "2k_uranus.jpg",
      note: "Cartografía de capas nubosas; no representa terreno sólido.",
      atmo: 0.35,
      glow: 0x86eaff,
      gas: true,
    },
    neptune: {
      name: "Neptuno",
      type: "GIGANTE DE HIELO",
      family: "Planetas",
      r: 24764,
      polar: 24341,
      mu: 6836529,
      rot: 57996,
      alt: 3500,
      color: LC + "2k_neptune.jpg",
      note: "Cartografía de capas nubosas; no representa terreno sólido.",
      atmo: 0.38,
      glow: 0x477cff,
      gas: true,
    },
    pluto: {
      name: "Plutón",
      type: "PLANETA ENANO",
      family: "Objetos transneptunianos",
      r: 1188.3,
      polar: 1188.3,
      mu: 869.6,
      rot: 551856,
      alt: 100,
      color: TX + "plutomap.jpg",
      height: TX + "plutomap.jpg",
      note: "Mosaico New Horizons; algunas regiones conservan menor resolución.",
      atmo: 0.06,
      glow: 0x9cbcff,
    },
  };
  Object.assign(BODIES, window.ORBITALIS_V2?.bodies || {});
  const CITIES = window.ORBITALIS_V2?.cities || {};
  const PAYLOADS = {
    optical: {
      name: "Multiespectral",
      color: 0x68ffb0,
      paint: "rgba(104,255,176,.54)",
    },
    altimetry: {
      name: "Altímetro láser",
      color: 0x65eaff,
      paint: "rgba(101,234,255,.58)",
    },
    sar: { name: "Radar SAR", color: 0xffc66e, paint: "rgba(255,198,110,.56)" },
    thermal: {
      name: "Infrarrojo térmico",
      color: 0xff718b,
      paint: "rgba(255,113,139,.55)",
    },
    ocean: {
      name: "Altímetro oceánico",
      color: 0x5d8fff,
      paint: "rgba(93,143,255,.56)",
    },
    atmosphere: {
      name: "Sondeador atmosférico",
      color: 0xb58cff,
      paint: "rgba(181,140,255,.52)",
    },
  };
  const SCAN_COLORS = [
    0x68ffb0, 0x65eaff, 0xffc66e, 0xff718b, 0xb58cff, 0x5d8fff, 0xffffff,
    0x62d6a8,
  ];
  const state = {
    body: "earth",
    time: 0,
    running: true,
    speed: 100,
    mapMode: "relief",
    textureDirty: false,
    mapDirty: true,
    lastUpload: 0,
    lastMapDraw: 0,
    lastTelemetry: 0,
    bodyAngle: 0,
    lastGeo: null,
    network: true,
    gnss: true,
    scanOverlay: true,
    flatLight: false,
    activeTab: "scan",
  };
  let scannerSerial = 1,
    activeScannerIndex = 0;

  const records = {};
  function record(key) {
    if (records[key]) return records[key];
    const scan = document.createElement("canvas"),
      mask = document.createElement("canvas");
    scan.width = mask.width = 1024;
    scan.height = mask.height = 512;
    return (records[key] = {
      scan,
      sc: scan.getContext("2d"),
      mask,
      mc: mask.getContext("2d"),
      last: {},
      covered: new Uint8Array(360 * 180),
      coveredWeight: 0,
      track: [],
      color: null,
      relief: null,
      water: null,
      landMask: null,
      oceanMask: null,
    });
  }

  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(
      42,
      innerWidth / innerHeight,
      0.01,
      420,
    ),
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
  camera.position.set(13, 6.5, 13);
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;
  $("scene").appendChild(renderer.domElement);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 5.2;
  controls.maxDistance = 65;
  controls.enablePan = false;
  const texLoader = new THREE.TextureLoader(),
    texCache = {};
  texLoader.setCrossOrigin("anonymous");
  function tex(file, srgb = true) {
    if (!file) return null;
    if (texCache[file]) return texCache[file];
    const t = texLoader.load(file, () => {}, undefined, showLoadError);
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (srgb) t.encoding = THREE.sRGBEncoding;
    return (texCache[file] = t);
  }
  const sky = texLoader.load(
    BASE + "night-sky.png",
    () => {},
    undefined,
    showLoadError,
  );
  sky.mapping = THREE.EquirectangularReflectionMapping;
  sky.encoding = THREE.sRGBEncoding;
  scene.background = sky;
  const ambient = new THREE.AmbientLight(0x24394a, 0.2);
  scene.add(ambient);
  const sunDir = new THREE.Vector3(1, 0.18, 0.36).normalize(),
    sun = new THREE.DirectionalLight(0xfff0d2, 1.65);
  sun.position.copy(sunDir).multiplyScalar(50);
  scene.add(sun);
  (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d"),
      g = x.createRadialGradient(128, 128, 1, 128, 128, 127);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.06, "#fff0b5");
    g.addColorStop(0.2, "rgba(255,166,55,.32)");
    g.addColorStop(1, "rgba(255,120,20,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    s.position.copy(sunDir).multiplyScalar(80);
    s.scale.set(10, 10, 1);
    scene.add(s);
  })();

  const bodyGroup = new THREE.Group();
  scene.add(bodyGroup);
  let globe,
    clouds,
    atmosphere,
    rings,
    nightLayer,
    scanShell,
    scanTexture,
    currentMat,
    flatMat,
    cloudLitMat,
    cloudFlatMat;
  const trackPositions = new Float32Array(MAX_TRACK * 3),
    trackGeometry = new THREE.BufferGeometry();
  trackGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(trackPositions, 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );
  trackGeometry.setDrawRange(0, 0);
  const trackLine = new THREE.Line(
    trackGeometry,
    new THREE.LineBasicMaterial({
      color: 0x6dffad,
      transparent: true,
      opacity: 0.74,
    }),
  );
  bodyGroup.add(trackLine);

  function makeSatellite(color) {
    const g = new THREE.Group(),
      gold = new THREE.MeshStandardMaterial({
        color: 0xcaa55a,
        metalness: 0.9,
        roughness: 0.2,
      }),
      blue = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.55,
        roughness: 0.22,
        emissive: color,
        emissiveIntensity: 0.2,
      }),
      black = new THREE.MeshStandardMaterial({
        color: 0x03080c,
        metalness: 0.7,
      });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.28), gold),
      sensor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.085, 0.12, 20),
        black,
      );
    sensor.rotation.x = Math.PI / 2;
    sensor.position.z = -0.19;
    const pg = new THREE.BoxGeometry(0.52, 0.012, 0.16),
      a = new THREE.Mesh(pg, blue),
      b = a.clone();
    a.position.x = 0.34;
    b.position.x = -0.34;
    g.add(body, sensor, a, b);
    return g;
  }
  function makeBeam(color) {
    const cone = new THREE.Mesh(
        new THREE.ConeGeometry(1, 1, 40, 1, true),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
      footprint = new THREE.Mesh(
        new THREE.RingGeometry(0.82, 1, 56),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.86,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
    scene.add(cone, footprint);
    return { cone, footprint };
  }
  function defaultScanner(index = 0) {
    const b = BODIES[state.body];
    return {
      id: "scan-" + scannerSerial++,
      name: "SCAN-" + String(index + 1).padStart(2, "0"),
      alt: b.alt * (1 + index * 0.08),
      ecc: 0.001,
      inc: index ? 97.4 : 98.2,
      raan: 20 + index * 42,
      fov: 18,
      look: 0,
      payload: index % 2 ? "altimetry" : "optical",
      scan: true,
      beam: true,
      color: SCAN_COLORS[index % SCAN_COLORS.length],
    };
  }
  const scanFleet = [];
  function createScanner(config) {
    const cfg = { ...defaultScanner(scanFleet.length), ...config },
      sat = makeSatellite(cfg.color),
      beam = makeBeam(cfg.color),
      orbitLine = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.42,
        }),
      );
    scene.add(sat, orbitLine);
    const s = {
      cfg,
      sat,
      orbitLine,
      ...beam,
      os: null,
      hit: null,
      swath: null,
    };
    scanFleet.push(s);
    rebuildOrbit(s);
    renderScannerTabs();
    return s;
  }
  function destroyScanner(s) {
    [s.sat, s.orbitLine, s.cone, s.footprint].forEach((o) => {
      scene.remove(o);
      o.geometry?.dispose();
      if (o.material) o.material.dispose();
    });
  }
  function activeScanner() {
    return scanFleet[clamp(activeScannerIndex, 0, scanFleet.length - 1)];
  }
  function renderScannerTabs() {
    const host = $("scannerTabs");
    host.innerHTML = "";
    scanFleet.forEach((s, i) => {
      const b = document.createElement("button");
      b.className = i === activeScannerIndex ? "active" : "";
      b.innerHTML = `<i style="background:#${s.cfg.color.toString(16).padStart(6, "0")}"></i>${s.cfg.name}`;
      b.onclick = () => {
        activeScannerIndex = i;
        renderScannerTabs();
        syncControlsFromScanner();
      };
      host.appendChild(b);
    });
    $("fleetCount").textContent = scanFleet.length + " / 8";
    $("removeScanner").disabled = scanFleet.length === 1;
  }
  function syncControlsFromScanner() {
    const c = activeScanner().cfg;
    $("scannerName").value = c.name;
    $("payload").value = c.payload;
    $("altitude").value = clamp(c.alt, +$("altitude").min, +$("altitude").max);
    $("eccentricity").value = c.ecc;
    $("inclination").value = c.inc;
    $("raan").value = (wrap(rad(c.raan)) * 180) / Math.PI;
    $("fov").value = c.fov;
    $("look").value = c.look;
    $("scanToggle").classList.toggle("on", c.scan);
    $("beamToggle").classList.toggle("on", c.beam);
    $("scannerTitle").textContent = c.name;
    $("scannerColor").style.background =
      "#" + c.color.toString(16).padStart(6, "0");
    updateLabels();
  }
  function syncScannerFromControls() {
    const s = activeScanner(),
      c = s.cfg;
    c.name = $("scannerName").value || c.name;
    c.payload = $("payload").value;
    c.alt = +$("altitude").value;
    c.ecc = +$("eccentricity").value;
    c.inc = +$("inclination").value;
    c.raan = +$("raan").value;
    c.fov = +$("fov").value;
    c.look = +$("look").value;
    record(state.body).last[c.id] = null;
    rebuildOrbit(s);
    renderScannerTabs();
    updateLabels();
  }

  function atmosphereMaterial(color, strength) {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        color: { value: new THREE.Color(color) },
        strength: { value: strength },
        sun: { value: sunDir },
      },
      vertexShader:
        "varying vec3 n;varying vec3 p;void main(){n=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",
      fragmentShader:
        "uniform vec3 color;uniform float strength;uniform vec3 sun;varying vec3 n;varying vec3 p;void main(){float rim=pow(1.0-clamp(dot(n,normalize(cameraPosition-p)),0.0,1.0),3.0);float day=.25+.75*smoothstep(-.4,.2,dot(n,sun));gl_FragColor=vec4(color,rim*day*strength);}",
    });
  }
  function makeRings() {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: { inner: { value: 6.15 }, outer: { value: 11.3 } },
      vertexShader:
        "varying float r;void main(){r=length(position.xy);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
      fragmentShader:
        "uniform float inner;uniform float outer;varying float r;void main(){float u=clamp((r-inner)/(outer-inner),0.0,1.0);float edge=smoothstep(0.0,.025,u)*(1.0-smoothstep(.965,1.0,u));float bands=.38+.28*sin(u*94.0)+.17*sin(u*237.0)+.09*sin(u*611.0);float gaps=smoothstep(.12,.5,bands);float cassini=1.0-smoothstep(.012,.026,abs(u-.61));float a=edge*gaps*(1.0-.88*cassini)*(.33+.62*u);vec3 c=mix(vec3(.42,.35,.25),vec3(.91,.82,.65),u);gl_FragColor=vec4(c,a*.82);}",
    });
    const m = new THREE.Mesh(new THREE.RingGeometry(6.15, 11.3, 256, 1), mat);
    m.rotation.x = Math.PI / 2;
    return m;
  }
  function removeBodyObject(o) {
    if (!o) return;
    bodyGroup.remove(o);
    o.geometry?.dispose();
    if (o.material) o.material.dispose();
  }
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = file;
    });
  }
  function makeGeoMasks(rec, img) {
    if (!img) return;
    try {
      const src = document.createElement("canvas"),
        x = src.getContext("2d", { willReadFrequently: true });
      src.width = 1280;
      src.height = 640;
      x.drawImage(img, 0, 0, 1280, 640);
      const data = x.getImageData(0, 0, 1280, 640),
        land = document.createElement("canvas"),
        ocean = document.createElement("canvas");
      land.width = ocean.width = 1280;
      land.height = ocean.height = 640;
      const ld = land.getContext("2d").createImageData(1280, 640),
        od = ocean.getContext("2d").createImageData(1280, 640);
      for (let p = 0; p < data.data.length; p += 4) {
        const lum = (data.data[p] + data.data[p + 1] + data.data[p + 2]) / 3,
          sea = clamp((lum - 25) * 2.3, 0, 255);
        ld.data[p] = ld.data[p + 1] = ld.data[p + 2] = 255;
        ld.data[p + 3] = 255 - sea;
        od.data[p] = od.data[p + 1] = od.data[p + 2] = 255;
        od.data[p + 3] = sea;
      }
      land.getContext("2d").putImageData(ld, 0, 0);
      ocean.getContext("2d").putImageData(od, 0, 0);
      rec.landMask = land;
      rec.oceanMask = ocean;
    } catch (e) {
      rec.landMask = rec.oceanMask = null;
    }
  }
  async function buildBody(key) {
    state.body = key;
    const b = BODIES[key],
      rec = record(key);
    $("loadStatus").textContent = "Cargando " + b.name + "…";
    $("loader").classList.remove("hide");
    [globe, clouds, atmosphere, rings, nightLayer, scanShell].forEach(
      removeBodyObject,
    );
    globe = clouds = atmosphere = rings = nightLayer = scanShell = null;
    flatMat?.dispose();
    cloudFlatMat?.dispose();
    flatMat = cloudLitMat = cloudFlatMat = null;
    const relief = +$("relief").value,
      height = tex(b.height, false),
      disp = b.height ? 0.0065 * relief : 0;
    currentMat = new THREE.MeshPhongMaterial({
      map: tex(b.color),
      bumpMap: height,
      bumpScale: b.height ? 0.012 * relief : 0,
      displacementMap: height,
      displacementScale: disp,
      specularMap: tex(b.specular, false),
      specular: new THREE.Color(b.specular ? 0x456778 : 0x07090a),
      shininess: b.specular ? 28 : 3,
    });
    flatMat = new THREE.MeshBasicMaterial({
      map: tex(b.color),
      displacementMap: height,
      displacementScale: disp,
    });
    globe = new THREE.Mesh(
      new THREE.SphereGeometry(VIS_R, 192, 112),
      currentMat,
    );
    globe.scale.y = b.polar / b.r;
    bodyGroup.add(globe);
    if (b.night) {
      const nm = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { lights: { value: tex(b.night) }, sun: { value: sunDir } },
        vertexShader:
          "varying vec2 u;varying vec3 n;void main(){u=uv;n=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
        fragmentShader:
          "uniform sampler2D lights;uniform vec3 sun;varying vec2 u;varying vec3 n;void main(){vec3 c=texture2D(lights,u).rgb;float l=smoothstep(.58,.92,max(c.r,max(c.g,c.b)));float dark=smoothstep(.04,-.18,dot(n,sun));vec3 city=pow(c,vec3(2.2))*vec3(1.25,.92,.58);gl_FragColor=vec4(city,l*dark*.72);}",
      });
      nightLayer = new THREE.Mesh(
        new THREE.SphereGeometry(VIS_R + disp + 0.006, 144, 80),
        nm,
      );
      nightLayer.scale.y = b.polar / b.r;
      bodyGroup.add(nightLayer);
    }
    if (b.clouds) {
      const cloudMap = tex(b.clouds),
        cloudOpacity = key === "venus" || key === "titan" ? 0.72 : 0.38;
      cloudLitMat = new THREE.MeshPhongMaterial({
        map: cloudMap,
        transparent: true,
        opacity: cloudOpacity,
        depthWrite: false,
      });
      cloudFlatMat = new THREE.MeshBasicMaterial({
        map: cloudMap,
        transparent: true,
        opacity: cloudOpacity,
        depthWrite: false,
      });
      clouds = new THREE.Mesh(
        new THREE.SphereGeometry(VIS_R + disp + 0.035, 160, 92),
        cloudLitMat,
      );
      clouds.scale.y = b.polar / b.r;
      bodyGroup.add(clouds);
    }
    if (b.atmo) {
      atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(
          VIS_R + Math.max(0.11, b.atmo * 0.23),
          112,
          72,
        ),
        atmosphereMaterial(b.glow, b.atmo),
      );
      atmosphere.scale.y = b.polar / b.r;
      bodyGroup.add(atmosphere);
    }
    if (b.ring) {
      rings = makeRings();
      bodyGroup.add(rings);
    }
    scanTexture = new THREE.CanvasTexture(rec.scan);
    scanTexture.minFilter = THREE.LinearFilter;
    scanShell = new THREE.Mesh(
      new THREE.SphereGeometry(VIS_R + disp + 0.018, 144, 80),
      new THREE.MeshBasicMaterial({
        map: scanTexture,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scanShell.scale.y = b.polar / b.r;
    bodyGroup.add(scanShell);
    try {
      [rec.color, rec.relief, rec.water] = await Promise.all([
        rec.color || loadImage(b.color),
        rec.relief || loadImage(b.height || b.color),
        rec.water || loadImage(b.specular),
      ]);
      if (rec.water && !rec.landMask) makeGeoMasks(rec, rec.water);
    } catch (e) {
      showLoadError();
      return;
    }
    const minAlt = Math.max(b.r < 100 ? 1 : 20, Math.round(b.r * 0.015)),
      maxAlt = Math.max(b.alt * 6, Math.round(b.r * 0.65));
    $("altitude").min = minAlt;
    $("altitude").max = maxAlt;
    $("altitude").step = Math.max(0.1, Math.round(b.r / 800));
    scanFleet.forEach((s, i) => {
      s.cfg.alt = clamp(b.alt * (1 + i * 0.08), minAlt, maxAlt);
      record(key).last[s.cfg.id] = null;
      rebuildOrbit(s);
    });
    $("worldName").textContent = b.name.toUpperCase();
    $("worldType").textContent = b.type;
    $("worldFamily").textContent = (b.family || "SISTEMA SOLAR").toUpperCase();
    $("tBody").textContent = b.name;
    $("dataNote").textContent = b.note;
    state.bodyAngle = state.time = 0;
    state.lastGeo = null;
    state.mapDirty = state.textureDirty = true;
    updateTrack();
    syncControlsFromScanner();
    refreshMapModes();
    applyLightingMode();
    $("loader").classList.add("hide");
  }

  function applyLightingMode() {
    const flat = state.flatLight;
    ambient.intensity = flat ? 1 : 0.2;
    sun.intensity = flat ? 0 : 1.65;
    if (globe && currentMat && flatMat)
      globe.material = flat ? flatMat : currentMat;
    if (clouds && cloudLitMat && cloudFlatMat)
      clouds.material = flat ? cloudFlatMat : cloudLitMat;
    if (atmosphere)
      atmosphere.visible =
        !flat && $("atmosphereToggle").classList.contains("on");
    if (nightLayer)
      nightLayer.visible = !flat && $("nightToggle").classList.contains("on");
  }

  function elements(cfg) {
    const b = BODIES[state.body],
      e = cfg.ecc,
      rp = b.r + cfg.alt,
      a = rp / (1 - e),
      p = a * (1 - e * e),
      n = Math.sqrt(b.mu / (a * a * a));
    return { b, e, rp, a, p, n, i: rad(cfg.inc), O: rad(cfg.raan) };
  }
  function solveE(M, e) {
    M = wrap(M);
    let E = M;
    for (let k = 0; k < 7; k++)
      E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return E;
  }
  function positionAt(t, cfg, trueAnomaly = null) {
    const el = elements(cfg);
    let f = trueAnomaly,
      r;
    if (f === null) {
      const E = solveE(el.n * t, el.e);
      f =
        2 *
        Math.atan2(
          Math.sqrt(1 + el.e) * Math.sin(E / 2),
          Math.sqrt(1 - el.e) * Math.cos(E / 2),
        );
      r = el.a * (1 - el.e * Math.cos(E));
    } else r = el.p / (1 + el.e * Math.cos(f));
    const cO = Math.cos(el.O),
      sO = Math.sin(el.O),
      cf = Math.cos(f),
      sf = Math.sin(f),
      ci = Math.cos(el.i),
      si = Math.sin(el.i),
      scale = VIS_R / el.b.r;
    return {
      el,
      r,
      f,
      pos: new THREE.Vector3(
        r * (cO * cf - sO * sf * ci),
        r * (sf * si),
        r * (sO * cf + cO * sf * ci),
      ).multiplyScalar(scale),
    };
  }
  function orbitState(t, cfg) {
    const o = positionAt(t, cfg),
      p2 = positionAt(t + 0.05, cfg).pos,
      vel = p2.sub(o.pos).normalize(),
      speed = Math.sqrt(o.el.b.mu * (2 / o.r - 1 / o.el.a));
    return { ...o, vel, speed, alt: o.r - o.el.b.r };
  }
  function rebuildOrbit(s) {
    if (!s) return;
    const pts = [];
    for (let k = 0; k <= 220; k++)
      pts.push(positionAt(state.time, s.cfg, (k / 220) * TAU).pos);
    s.orbitLine.geometry.dispose();
    s.orbitLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
  }
  function intersect(os, dir) {
    const b = BODIES[state.body],
      a = VIS_R,
      c = (VIS_R * b.polar) / b.r,
      A = (dir.x * dir.x + dir.z * dir.z) / (a * a) + (dir.y * dir.y) / (c * c),
      B =
        2 *
        ((os.pos.x * dir.x + os.pos.z * dir.z) / (a * a) +
          (os.pos.y * dir.y) / (c * c)),
      C =
        (os.pos.x * os.pos.x + os.pos.z * os.pos.z) / (a * a) +
        (os.pos.y * os.pos.y) / (c * c) -
        1,
      D = B * B - 4 * A * C;
    if (D < 0) return null;
    const q = (-B - Math.sqrt(D)) / (2 * A);
    return q > 0 ? os.pos.clone().addScaledVector(dir, q) : null;
  }
  function hitAt(os, look) {
    const nadir = os.pos.clone().negate().normalize(),
      cross = new THREE.Vector3().crossVectors(os.pos, os.vel).normalize(),
      l = rad(look),
      dir = nadir
        .multiplyScalar(Math.cos(l))
        .add(cross.multiplyScalar(Math.sin(l)))
        .normalize();
    return intersect(os, dir);
  }
  function toLocal(world, angle) {
    return world.clone().applyAxisAngle(Y, -angle);
  }
  function geo(local) {
    const b = BODIES[state.body],
      lon = -Math.atan2(local.z, local.x),
      p = Math.hypot(local.x, local.z),
      e2 = 1 - (b.polar * b.polar) / (b.r * b.r),
      lat = Math.atan2(local.y, p * (1 - e2));
    return { lat, lon };
  }
  function mapUV(g) {
    return {
      u: wrap(g.lon + Math.PI) / TAU,
      v: clamp(0.5 - g.lat / Math.PI, 0, 1),
    };
  }
  function sensorView(s, os, hit) {
    if (!hit) return null;
    const c = s.cfg,
      h1 = hitAt(os, c.look - c.fov / 2),
      h2 = hitAt(os, c.look + c.fov / 2),
      dist = os.pos.distanceTo(hit),
      radius =
        h1 && h2 ? h1.distanceTo(h2) / 2 : dist * Math.tan(rad(c.fov / 2)),
      b = BODIES[state.body],
      normal = new THREE.Vector3(
        hit.x / (VIS_R * VIS_R),
        hit.y / ((VIS_R * b.polar) / b.r) ** 2,
        hit.z / (VIS_R * VIS_R),
      ).normalize();
    s.cone.visible = c.beam;
    s.footprint.visible = c.beam;
    s.cone.position.copy(os.pos).lerp(hit, 0.5);
    s.cone.scale.set(radius, dist, radius);
    s.cone.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      hit.clone().sub(os.pos).normalize(),
    );
    s.footprint.position.copy(hit).addScaledVector(normal, 0.012);
    s.footprint.scale.setScalar(radius);
    s.footprint.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal,
    );
    const swath =
      h1 && h2
        ? b.r *
          Math.acos(
            clamp(
              toLocal(h1, state.bodyAngle)
                .normalize()
                .dot(toLocal(h2, state.bodyAngle).normalize()),
              -1,
              1,
            ),
          )
        : 2 * os.alt * Math.tan(rad(c.fov / 2));
    return { swath, radius };
  }
  function drawPath(ctx, last, x, y, width, color, glow) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(2, width * 1.65);
    ctx.lineCap = "round";
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
    }
    if (last) {
      let lx = last.x,
        xx = x;
      if (Math.abs(xx - lx) > 512) {
        if (xx > lx) lx += 1024;
        else xx += 1024;
      }
      for (const off of [-1024, 0, 1024]) {
        ctx.beginPath();
        ctx.moveTo(lx + off, last.y);
        ctx.lineTo(xx + off, y);
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.arc(x, y, width, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
  function paint(world, angle, swath, s) {
    if (!s.cfg.scan || !world) return;
    const rec = record(state.body),
      g = geo(toLocal(world, angle)),
      uv = mapUV(g),
      x = uv.u * 1024,
      y = uv.v * 512,
      px = Math.max(1.2, (swath / (TAU * BODIES[state.body].r)) * 1024),
      last = rec.last[s.cfg.id],
      color = PAYLOADS[s.cfg.payload].paint;
    drawPath(rec.sc, last, x, y, px, color, true);
    drawPath(rec.mc, last, x, y, px, "#fff", false);
    rec.last[s.cfg.id] = { x: (x + 1024) % 1024, y };
    state.textureDirty = state.mapDirty = true;
    const col = Math.floor(uv.u * 360) % 360,
      row = clamp(Math.floor(uv.v * 180), 0, 179),
      cr = Math.max(1, Math.ceil((swath / (TAU * BODIES[state.body].r)) * 360));
    for (let rr = -cr; rr <= cr; rr++)
      for (let cc = -cr; cc <= cr; cc++) {
        const tr = row + rr;
        if (tr < 0 || tr >= 180) continue;
        const tc = (col + cc + 360) % 360,
          idx = tr * 360 + tc;
        if (!rec.covered[idx]) {
          rec.covered[idx] = 1;
          rec.coveredWeight += Math.cos(((tr + 0.5) / 180 - 0.5) * Math.PI);
        }
      }
    const local = toLocal(world, angle)
      .normalize()
      .multiply(
        new THREE.Vector3(
          5.025,
          (5.025 * BODIES[state.body].polar) / BODIES[state.body].r,
          5.025,
        ),
      );
    if (
      !rec.track.length ||
      rec.track[rec.track.length - 1].distanceTo(local) > 0.025
    ) {
      rec.track.push(local);
      if (rec.track.length > MAX_TRACK) rec.track.shift();
    }
  }
  function updateTrack() {
    const tr = record(state.body).track,
      n = tr.length;
    for (let i = 0; i < n; i++) {
      trackPositions[i * 3] = tr[i].x;
      trackPositions[i * 3 + 1] = tr[i].y;
      trackPositions[i * 3 + 2] = tr[i].z;
    }
    trackGeometry.attributes.position.needsUpdate = true;
    trackGeometry.setDrawRange(0, n);
  }
  function coverage() {
    const rec = record(state.body),
      total = (360 * 180 * 2) / Math.PI;
    return clamp((rec.coveredWeight / total) * 100, 0, 100);
  }

  const mapCtx = $("mapCanvas").getContext("2d"),
    compose = document.createElement("canvas"),
    composeCtx = compose.getContext("2d");
  compose.width = 1280;
  compose.height = 640;
  function redrawMap() {
    const rec = record(state.body),
      base = state.mapMode === "relief" ? rec.relief : rec.color;
    if (!base) return;
    mapCtx.fillStyle = "#010407";
    mapCtx.fillRect(0, 0, 1280, 640);
    mapCtx.save();
    mapCtx.globalAlpha = 0.07;
    mapCtx.drawImage(base, 0, 0, 1280, 640);
    mapCtx.restore();
    composeCtx.clearRect(0, 0, 1280, 640);
    composeCtx.save();
    composeCtx.drawImage(base, 0, 0, 1280, 640);
    if (state.mapMode === "land" && rec.landMask) {
      composeCtx.globalCompositeOperation = "destination-in";
      composeCtx.drawImage(rec.landMask, 0, 0);
    }
    if (state.mapMode === "ocean" && rec.oceanMask) {
      composeCtx.globalCompositeOperation = "destination-in";
      composeCtx.drawImage(rec.oceanMask, 0, 0);
    }
    composeCtx.globalCompositeOperation = "destination-in";
    composeCtx.drawImage(rec.mask, 0, 0, 1280, 640);
    composeCtx.restore();
    mapCtx.drawImage(compose, 0, 0);
    if (state.lastGeo) {
      const uv = mapUV(state.lastGeo),
        x = uv.u * 1280,
        y = uv.v * 640;
      mapCtx.save();
      mapCtx.strokeStyle = "#fff";
      mapCtx.lineWidth = 1.5;
      mapCtx.shadowColor = "#65eaff";
      mapCtx.shadowBlur = 9;
      mapCtx.beginPath();
      mapCtx.arc(x, y, 6, 0, TAU);
      mapCtx.moveTo(x - 11, y);
      mapCtx.lineTo(x + 11, y);
      mapCtx.moveTo(x, y - 11);
      mapCtx.lineTo(x, y + 11);
      mapCtx.stroke();
      mapCtx.restore();
    }
    state.mapDirty = false;
  }
  function availableMapModes() {
    const b = BODIES[state.body],
      rec = record(state.body),
      modes = ["visual"];
    if (b.height && b.height !== b.color) modes.unshift("relief");
    if (state.body === "earth" && rec.landMask && rec.oceanMask)
      modes.push("land", "ocean");
    return modes;
  }
  function refreshMapModes() {
    const modes = availableMapModes();
    document.querySelectorAll("[data-mapmode]").forEach((button) => {
      button.hidden = !modes.includes(button.dataset.mapmode);
    });
    if (!modes.includes(state.mapMode))
      state.mapMode = modes.includes("relief") ? "relief" : "visual";
    setMapMode(state.mapMode);
  }
  function resetMap() {
    const rec = record(state.body);
    rec.sc.clearRect(0, 0, 1024, 512);
    rec.mc.clearRect(0, 0, 1024, 512);
    rec.covered.fill(0);
    rec.coveredWeight = 0;
    rec.track = [];
    rec.last = {};
    state.textureDirty = state.mapDirty = true;
    updateTrack();
  }
  function setMapMode(mode) {
    if (!availableMapModes().includes(mode)) return;
    state.mapMode = mode;
    document
      .querySelectorAll("[data-mapmode]")
      .forEach((x) => x.classList.toggle("active", x.dataset.mapmode === mode));
    const b = BODIES[state.body],
      names = {
        relief: b.gas ? "NUBES" : "ALTIMETRÍA",
        visual: "IMAGEN ORBITAL",
        land: "TIERRA FIRME",
        ocean: "SUPERFICIE OCEÁNICA",
      };
    $("mapTitle").textContent = b.name.toUpperCase() + " · " + names[mode];
    $("mapType").textContent = names[mode];
    state.mapDirty = true;
  }
  function updateLabels(s = activeScanner(), g = state.lastGeo) {
    if (!s) return;
    const c = s.cfg,
      b = BODIES[state.body],
      el = elements(c),
      o = s.os || orbitState(state.time, c),
      pct = coverage();
    $("altitudeOut").textContent =
      Math.round(c.alt).toLocaleString("es-ES") + " km";
    $("eccentricityOut").textContent = c.ecc.toFixed(3);
    $("inclinationOut").textContent = c.inc.toFixed(1) + "°";
    $("raanOut").textContent = Math.round(c.raan) + "°";
    $("fovOut").textContent = c.fov + "°";
    $("lookOut").textContent = c.look + "°";
    $("reliefOut").textContent = "×" + $("relief").value;
    $("exposureOut").textContent = (+$("exposure").value)
      .toFixed(2)
      .replace(".", ",");
    $("satScaleOut").textContent =
      "×" + (+$("satScale").value).toFixed(1).replace(".", ",");
    $("tAltitude").textContent =
      Math.round(o.alt).toLocaleString("es-ES") + " km";
    $("tVelocity").textContent = o.speed.toFixed(2) + " km/s";
    $("tPeriod").textContent = (TAU / el.n / 60).toFixed(1) + " min";
    if (g) {
      $("tCoords").textContent =
        `${Math.abs(deg(g.lat)).toFixed(1)}°${g.lat >= 0 ? "N" : "S"} · ${Math.abs(deg(g.lon)).toFixed(1)}°${g.lon >= 0 ? "E" : "O"}`;
      $("mapCoordinates").textContent =
        `${c.name} · LAT ${deg(g.lat).toFixed(2)}° · LON ${deg(g.lon).toFixed(2)}°`;
    }
    $("tSwath").textContent =
      s.swath == null
        ? "—"
        : Math.round(s.swath).toLocaleString("es-ES") + " km";
    $("tCoverage").textContent = pct.toFixed(2) + "%";
    $("mapCoverage").textContent = pct.toFixed(2) + "% REVELADO";
    $("mapProgress").style.width = pct + "%";
    document
      .querySelectorAll("input[type=range]")
      .forEach((x) =>
        x.style.setProperty(
          "--fill",
          ((x.value - x.min) / (x.max - x.min)) * 100 + "%",
        ),
      );
  }

  const commGroup = new THREE.Group();
  scene.add(commGroup);
  let commSats = [],
    commMarkers = [],
    commLine,
    networkTargets = ["jakarta", "sydney"];
  function renderCities() {
    const source = $("stationA"),
      receiver = $("receiverCity"),
      groups = {};
    Object.entries(CITIES).forEach(([key, c]) =>
      (groups[c.region] ??= []).push([key, c]),
    );
    [source, receiver].forEach((sel) => {
      sel.innerHTML = "";
      Object.entries(groups).forEach(([region, list]) => {
        const g = document.createElement("optgroup");
        g.label = region;
        list.forEach(([key, c]) => {
          const o = document.createElement("option");
          o.value = key;
          o.textContent = c.name;
          g.appendChild(o);
        });
        sel.appendChild(g);
      });
    });
    source.value = "madrid";
    receiver.value = "madrid";
    renderTargetPicker();
    renderSelectedTargets();
  }
  function renderTargetPicker() {
    const picker = $("targetPicker"),
      source = $("stationA").value,
      groups = {};
    picker.innerHTML = "";
    Object.entries(CITIES)
      .filter(([key]) => key !== source && !networkTargets.includes(key))
      .forEach(([key, city]) => (groups[city.region] ??= []).push([key, city]));
    Object.entries(groups).forEach(([region, list]) => {
      const group = document.createElement("optgroup");
      group.label = region;
      list.forEach(([key, city]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = city.name;
        group.appendChild(option);
      });
      picker.appendChild(group);
    });
    $("addTarget").disabled = !picker.options.length;
  }
  function renderSelectedTargets() {
    const host = $("selectedTargets");
    host.innerHTML = "";
    if (!networkTargets.length) {
      const empty = document.createElement("small");
      empty.textContent = "No hay destinos seleccionados.";
      host.appendChild(empty);
    }
    networkTargets.forEach((key) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.innerHTML = `<span>${CITIES[key].name}</span><b aria-hidden="true">×</b>`;
      chip.setAttribute("aria-label", `Quitar ${CITIES[key].name}`);
      chip.onclick = () =>
        setNetworkTargets(networkTargets.filter((x) => x !== key));
      host.appendChild(chip);
    });
    renderTargetPicker();
  }
  function setNetworkTargets(keys) {
    const source = $("stationA").value;
    networkTargets = [...new Set(keys)]
      .filter((key) => CITIES[key] && key !== source)
      .slice(0, 12);
    renderSelectedTargets();
    updateNetwork();
  }
  function selectedTargets() {
    return networkTargets;
  }
  function rebuildComm() {
    while (commGroup.children.length) commGroup.remove(commGroup.children[0]);
    commSats = [];
    commMarkers = [];
    const n = +$("constellation").value,
      satMat = new THREE.MeshBasicMaterial({ color: 0x65eaff });
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), satMat);
      commGroup.add(m);
      commSats.push(m);
    }
    commLine = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0x68ffb0,
        transparent: true,
        opacity: 0.82,
      }),
    );
    commGroup.add(commLine);
    commGroup.visible = state.network && state.activeTab === "network";
  }
  function stationWorld(key) {
    const c = CITIES[key],
      lat = rad(c.lat),
      lon = rad(c.lon),
      b = BODIES[state.body],
      p = new THREE.Vector3(
        Math.cos(lat) * Math.cos(-lon) * 5.04,
        (Math.sin(lat) * 5.04 * b.polar) / b.r,
        Math.cos(lat) * Math.sin(-lon) * 5.04,
      );
    return p.applyAxisAngle(Y, state.bodyAngle);
  }
  function clearSegment(a, b) {
    const d = b.clone().sub(a),
      t = clamp(-a.dot(d) / d.lengthSq(), 0, 1),
      closest = a.clone().addScaledVector(d, t);
    return closest.length() > VIS_R * 1.018;
  }
  function visibleFrom(ground, p, minElevation = 0) {
    const los = p.clone().sub(ground).normalize(),
      normal = ground.clone().normalize();
    return Math.asin(clamp(los.dot(normal), -1, 1)) >= rad(minElevation);
  }
  function routeTo(a, z, positions) {
    const va = [],
      vb = [];
    positions.forEach((p, i) => {
      if (visibleFrom(a, p)) va.push(i);
      if (visibleFrom(z, p)) vb.push(i);
    });
    const target = new Set(vb),
      queue = va.map((i) => [i, [i]]),
      seen = new Set(va);
    while (queue.length) {
      const [i, path] = queue.shift();
      if (target.has(i)) return { path, visible: va.length };
      for (let j = 0; j < positions.length; j++)
        if (!seen.has(j) && clearSegment(positions[i], positions[j])) {
          seen.add(j);
          queue.push([j, path.concat(j)]);
        }
    }
    return { path: null, visible: va.length };
  }
  function ensureCommMarkers(n) {
    while (commMarkers.length < n) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 10, 7),
        new THREE.MeshBasicMaterial({ color: 0xffc66e }),
      );
      commGroup.add(m);
      commMarkers.push(m);
    }
    commMarkers.forEach((m, i) => (m.visible = i < n));
  }
  function updateNetwork() {
    commGroup.visible = state.network && state.activeTab === "network";
    if (!state.network || !commSats.length) return;
    const b = BODIES[state.body],
      n = commSats.length,
      alt = +$("networkAlt").value,
      r = (VIS_R * (b.r + alt)) / b.r,
      period = TAU / Math.sqrt(b.mu / Math.pow(b.r + alt, 3)),
      positions = [];
    for (let k = 0; k < n; k++) {
      const planes = Math.min(6, Math.max(3, Math.round(n / 5))),
        plane = k % planes,
        slot = Math.floor(k / planes),
        slots = Math.ceil(n / planes),
        phase =
          (state.time / period) * TAU +
          (slot / slots) * TAU +
          (plane % 2) * 0.25,
        inc = rad(48 + (plane % 3) * 15),
        raan = (plane / planes) * TAU,
        p = new THREE.Vector3(
          r * Math.cos(phase),
          r * Math.sin(phase) * Math.sin(inc),
          r * Math.sin(phase) * Math.cos(inc),
        ).applyAxisAngle(Y, raan);
      commSats[k].position.copy(p);
      positions.push(p);
    }
    const sourceKey = $("stationA").value,
      targets = selectedTargets(),
      a = stationWorld(sourceKey);
    ensureCommMarkers(targets.length + 1);
    commMarkers[0].position.copy(a);
    const pts = [];
    let connected = 0,
      maxHops = 0,
      totalDelay = 0,
      visibleOrigin = 0;
    targets.forEach((key, idx) => {
      const z = stationWorld(key),
        result = routeTo(a, z, positions);
      commMarkers[idx + 1].position.copy(z);
      visibleOrigin = Math.max(visibleOrigin, result.visible);
      if (!result.path) return;
      connected++;
      maxHops = Math.max(maxHops, result.path.length);
      const route = result.path;
      pts.push(a, positions[route[0]]);
      let dist =
        a.distanceTo(positions[route[0]]) +
        z.distanceTo(positions[route.at(-1)]);
      for (let i = 1; i < route.length; i++) {
        pts.push(positions[route[i - 1]], positions[route[i]]);
        dist += positions[route[i - 1]].distanceTo(positions[route[i]]);
      }
      pts.push(positions[route.at(-1)], z);
      totalDelay += (dist * b.r) / VIS_R / 299.792458;
    });
    commLine.geometry.dispose();
    commLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
    $("connectedTargets").textContent = connected + " / " + targets.length;
    $("visibleA").textContent = visibleOrigin;
    $("routeHops").textContent = connected ? maxHops + " sat." : "—";
    $("routeDelay").textContent = connected
      ? (totalDelay / connected).toFixed(1) + " ms"
      : "—";
    $("linkState").textContent = !targets.length
      ? "SELECCIONA DESTINOS"
      : connected === targets.length
        ? "TODAS LAS RUTAS ACTIVAS"
        : connected
          ? "COBERTURA PARCIAL"
          : "SIN COBERTURA";
    $("linkState").classList.toggle(
      "online",
      connected === targets.length && targets.length > 0,
    );
  }
  function updateNetworkLabels() {
    $("constellationOut").textContent = $("constellation").value;
    $("networkAltOut").textContent =
      (+$("networkAlt").value).toLocaleString("es-ES") + " km";
  }

  const gnssGroup = new THREE.Group();
  scene.add(gnssGroup);
  let gnssSats = [],
    gnssLine,
    receiverMarker;
  function gnssConfig() {
    const type = $("gnssSystem").value;
    return type === "galileo"
      ? { n: 24, planes: 3, alt: 23222, inc: 56, period: 14.08 }
      : type === "mixed"
        ? { n: 30, planes: 6, alt: 21400, inc: 55.5, period: 12.7 }
        : { n: 24, planes: 6, alt: 20200, inc: 55, period: 11.97 };
  }
  function rebuildGNSS() {
    while (gnssGroup.children.length) gnssGroup.remove(gnssGroup.children[0]);
    gnssSats = [];
    const cfg = gnssConfig(),
      mat = new THREE.MeshBasicMaterial({ color: 0xd9f3ff });
    for (let i = 0; i < cfg.n; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), mat);
      gnssGroup.add(m);
      gnssSats.push(m);
    }
    receiverMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 7),
      new THREE.MeshBasicMaterial({ color: 0xffc66e }),
    );
    gnssGroup.add(receiverMarker);
    gnssLine = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0x65eaff,
        transparent: true,
        opacity: 0.55,
      }),
    );
    gnssGroup.add(gnssLine);
  }
  function updateGNSSFlow(visible = 0, solved = false) {
    const activeSteps = visible ? (solved ? 4 : visible >= 3 ? 3 : 2) : 0;
    document.querySelectorAll("[data-gnss-step]").forEach((step, index) => {
      step.classList.toggle("active", index < activeSteps);
    });
  }
  function updateGNSS() {
    gnssGroup.visible =
      state.gnss && state.body === "earth" && state.activeTab === "gnss";
    if (!gnssGroup.visible) {
      if (state.body !== "earth") {
        $("fixState").textContent = "GNSS DISPONIBLE EN LA TIERRA";
        $("gnssVisible").textContent = "0";
        $("gdop").textContent = "—";
        $("positionError").textContent = "—";
        $("skyPlot").innerHTML = "";
      }
      $("fixState").classList.remove("online");
      updateGNSSFlow();
      return;
    }
    const cfg = gnssConfig(),
      r = (VIS_R * (6378.137 + cfg.alt)) / 6378.137,
      omega = TAU / (cfg.period * 3600),
      positions = [];
    gnssSats.forEach((m, k) => {
      const plane = k % cfg.planes,
        slot = Math.floor(k / cfg.planes),
        slots = Math.ceil(cfg.n / cfg.planes),
        phase = state.time * omega + (slot / slots) * TAU + (plane % 2) * 0.18,
        raan = (plane / cfg.planes) * TAU,
        inc = rad(cfg.inc),
        p = new THREE.Vector3(
          r * Math.cos(phase),
          r * Math.sin(phase) * Math.sin(inc),
          r * Math.sin(phase) * Math.cos(inc),
        ).applyAxisAngle(Y, raan);
      m.position.copy(p);
      positions.push(p);
    });
    const ground = stationWorld($("receiverCity").value),
      mask = +$("elevationMask").value;
    receiverMarker.position.copy(ground);
    const visible = positions
        .map((p, i) => ({
          p,
          i,
          elev: Math.asin(
            p.clone().sub(ground).normalize().dot(ground.clone().normalize()),
          ),
        }))
        .filter((x) => x.elev >= rad(mask)),
      pts = [];
    visible.forEach((x) => pts.push(ground, x.p));
    gnssLine.geometry.dispose();
    gnssLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const spread = visible.length
        ? visible.reduce((a, x) => a + Math.cos(x.elev), 0) / visible.length
        : 1,
      gdop =
        visible.length >= 4
          ? clamp(8.5 / (visible.length - 1) + spread * 1.2, 1.1, 9.9)
          : null,
      base = Math.hypot(
        +$("clockError").value,
        +$("atmoError").value,
        +$("multipath").value,
      ),
      error = gdop ? gdop * base : null;
    $("gnssVisible").textContent = visible.length;
    $("gdop").textContent = gdop ? gdop.toFixed(2) : "—";
    $("positionError").textContent = error ? error.toFixed(1) + " m" : "—";
    $("gnssAltitude").textContent = cfg.alt.toLocaleString("es-ES") + " km";
    $("gnssPeriod").textContent =
      cfg.period.toFixed(1).replace(".", ",") + " h";
    $("fixState").textContent =
      visible.length >= 4
        ? "SOLUCIÓN 3D + TIEMPO"
        : visible.length
          ? "GEOMETRÍA INSUFICIENTE"
          : "SIN SEÑAL";
    $("fixState").classList.toggle("online", visible.length >= 4);
    updateGNSSFlow(visible.length, visible.length >= 4);
    renderSkyPlot(visible, ground);
  }
  function renderSkyPlot(visible, ground) {
    const host = $("skyPlot");
    host.innerHTML = "";
    const normal = ground.clone().normalize(),
      east = new THREE.Vector3(-normal.z, 0, normal.x).normalize(),
      north = new THREE.Vector3().crossVectors(normal, east).normalize();
    visible.forEach((x) => {
      const los = x.p.clone().sub(ground).normalize(),
        az = Math.atan2(los.dot(east), los.dot(north)),
        rr = (1 - x.elev / (Math.PI / 2)) * 47,
        i = document.createElement("i");
      i.style.left = 50 + Math.sin(az) * rr + "%";
      i.style.top = 50 - Math.cos(az) * rr + "%";
      i.title = "Elevación " + deg(x.elev).toFixed(0) + "°";
      host.appendChild(i);
    });
  }
  function updateGNSSLabels() {
    $("elevationOut").textContent = $("elevationMask").value + "°";
    $("clockOut").textContent =
      (+$("clockError").value).toFixed(1).replace(".", ",") + " m";
    $("atmoErrorOut").textContent =
      (+$("atmoError").value).toFixed(1).replace(".", ",") + " m";
    $("multipathOut").textContent =
      (+$("multipath").value).toFixed(1).replace(".", ",") + " m";
  }

  function renderBodySelect() {
    const groups = {};
    Object.entries(BODIES).forEach(([key, b]) =>
      (groups[b.family || "Otros"] ??= []).push([key, b]),
    );
    const select = $("bodySelect");
    select.innerHTML = "";
    Object.entries(groups).forEach(([family, list]) => {
      const g = document.createElement("optgroup");
      g.label = family;
      list
        .sort((a, b) => a[1].name.localeCompare(b[1].name, "es"))
        .forEach(([key, b]) => {
          const o = document.createElement("option");
          o.value = key;
          o.textContent = b.name;
          g.appendChild(o);
        });
      select.appendChild(g);
    });
    select.value = state.body;
  }
  function showLoadError() {
    $("loader").classList.add("hide");
    $("error").classList.remove("hidden");
  }

  let last = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    const delta = state.running ? dt * state.speed : 0,
      old = state.time;
    state.time += delta;
    const b = BODIES[state.body];
    state.bodyAngle = wrap(
      state.bodyAngle + (b.rot ? (delta / b.rot) * TAU : 0),
    );
    bodyGroup.rotation.y = state.bodyAngle;
    if (clouds)
      clouds.rotation.y +=
        dt * (state.body === "venus" || state.body === "titan" ? 0.006 : 0.012);
    const showScanners =
      state.activeTab === "scan" || state.activeTab === "visual";
    scanFleet.forEach((s, idx) => {
      if (s.cfg.scan && delta > 0) {
        const samples = clamp(Math.ceil(delta / 45), 1, 3);
        for (let k = 1; k <= samples; k++) {
          const t = old + (delta * k) / samples,
            angle = wrap(
              state.bodyAngle - (b.rot ? ((state.time - t) / b.rot) * TAU : 0),
            ),
            os = orbitState(t, s.cfg),
            hit = hitAt(os, s.cfg.look);
          if (hit)
            paint(hit, angle, 2 * os.alt * Math.tan(rad(s.cfg.fov / 2)), s);
        }
      }
      const os = orbitState(state.time, s.cfg),
        hit = hitAt(os, s.cfg.look),
        sv = sensorView(s, os, hit);
      s.os = os;
      s.hit = hit;
      s.swath = sv?.swath ?? null;
      s.sat.position.copy(os.pos);
      s.sat.lookAt(hit || new THREE.Vector3());
      s.sat.scale.setScalar(0.78 * +$("satScale").value);
      s.sat.visible = showScanners;
      s.cone.visible = showScanners && s.cfg.beam;
      s.footprint.visible = showScanners && s.cfg.beam;
      s.orbitLine.visible =
        showScanners && $("orbitToggle").classList.contains("on");
      if (idx === activeScannerIndex) {
        state.lastGeo = hit ? geo(toLocal(hit, state.bodyAngle)) : null;
      }
    });
    trackLine.visible =
      showScanners && $("trackToggle").classList.contains("on");
    if (scanShell) scanShell.visible = showScanners && state.scanOverlay;
    if (clouds) clouds.visible = $("cloudToggle").classList.contains("on");
    if (atmosphere)
      atmosphere.visible =
        !state.flatLight && $("atmosphereToggle").classList.contains("on");
    if (nightLayer)
      nightLayer.visible =
        !state.flatLight && $("nightToggle").classList.contains("on");
    if (state.textureDirty && now - state.lastUpload > 180) {
      scanTexture.needsUpdate = true;
      state.textureDirty = false;
      state.lastUpload = now;
    }
    if (state.mapDirty && now - state.lastMapDraw > 240) {
      redrawMap();
      state.lastMapDraw = now;
    }
    if (now - state.lastTelemetry > 350) {
      updateTrack();
      updateLabels();
      updateNetwork();
      updateGNSS();
      state.lastTelemetry = now;
    }
    controls.update();
    renderer.render(scene, camera);
  }

  $("menuButton").onclick = () => $("drawer").classList.add("open");
  $("closeDrawer").onclick = () => $("drawer").classList.remove("open");
  $("bodySelect").onchange = () => buildBody($("bodySelect").value);
  document.querySelectorAll("[data-tab]").forEach(
    (btn) =>
      (btn.onclick = () => {
        state.activeTab = btn.dataset.tab;
        document
          .querySelectorAll("[data-tab]")
          .forEach((x) => x.classList.toggle("active", x === btn));
        document
          .querySelectorAll("[data-pane]")
          .forEach((x) =>
            x.classList.toggle("active", x.dataset.pane === btn.dataset.tab),
          );
        $("mapPanel").classList.toggle(
          "mode-hidden",
          !["scan", "visual"].includes(btn.dataset.tab),
        );
        commGroup.visible = state.network && btn.dataset.tab === "network";
        gnssGroup.visible =
          state.gnss && state.body === "earth" && btn.dataset.tab === "gnss";
        if (btn.dataset.tab === "gnss" && state.body !== "earth") {
          $("bodySelect").value = "earth";
          buildBody("earth");
        }
      }),
  );
  [
    "scannerName",
    "payload",
    "altitude",
    "eccentricity",
    "inclination",
    "raan",
    "fov",
    "look",
  ].forEach((id) => ($(id).oninput = syncScannerFromControls));
  $("addScanner").onclick = () => {
    if (scanFleet.length >= 8) return;
    const base = activeScanner().cfg,
      s = createScanner({
        ...base,
        id: "scan-" + scannerSerial++,
        name: "SCAN-" + String(scanFleet.length + 1).padStart(2, "0"),
        raan:
          (wrap(rad(base.raan + 360 / (scanFleet.length + 1))) * 180) / Math.PI,
        color: SCAN_COLORS[scanFleet.length % SCAN_COLORS.length],
      });
    activeScannerIndex = scanFleet.indexOf(s);
    renderScannerTabs();
    syncControlsFromScanner();
  };
  $("cloneScanner").onclick = () => {
    if (scanFleet.length >= 8) return;
    const base = activeScanner().cfg,
      s = createScanner({
        ...base,
        id: "scan-" + scannerSerial++,
        name: base.name + " B",
        raan: (wrap(rad(base.raan + 30)) * 180) / Math.PI,
        color: SCAN_COLORS[scanFleet.length % SCAN_COLORS.length],
      });
    activeScannerIndex = scanFleet.indexOf(s);
    renderScannerTabs();
    syncControlsFromScanner();
  };
  $("removeScanner").onclick = () => {
    if (scanFleet.length === 1) return;
    const [s] = scanFleet.splice(activeScannerIndex, 1);
    destroyScanner(s);
    activeScannerIndex = clamp(activeScannerIndex - 1, 0, scanFleet.length - 1);
    renderScannerTabs();
    syncControlsFromScanner();
  };
  document.querySelectorAll("[data-preset]").forEach(
    (btn) =>
      (btn.onclick = () => {
        const c = activeScanner().cfg,
          p = btn.dataset.preset,
          b = BODIES[state.body];
        if (p === "polar")
          Object.assign(c, {
            alt: b.alt,
            inc: 90,
            ecc: 0.001,
            raan: 0,
            fov: 22,
            look: 0,
            payload: "altimetry",
          });
        if (p === "landsat")
          Object.assign(c, {
            alt: 705,
            inc: 98.2,
            ecc: 0.001,
            raan: 15,
            fov: 15,
            look: 0,
            payload: "optical",
          });
        if (p === "sentinel")
          Object.assign(c, {
            alt: 786,
            inc: 98.6,
            ecc: 0.001,
            raan: 35,
            fov: 28,
            look: 0,
            payload: "sar",
          });
        if (p === "iss")
          Object.assign(c, {
            name: "ISS · PERFIL",
            alt: 408,
            inc: 51.64,
            ecc: 0.0003,
            raan: 0,
            fov: 36,
            look: 0,
            payload: "optical",
          });
        c.alt = clamp(c.alt, +$("altitude").min, +$("altitude").max);
        syncControlsFromScanner();
        rebuildOrbit(activeScanner());
      }),
  );
  document.querySelectorAll(".switch").forEach(
    (btn) =>
      (btn.onclick = () => {
        btn.classList.toggle("on");
        const on = btn.classList.contains("on");
        if (btn.id === "scanToggle") activeScanner().cfg.scan = on;
        if (btn.id === "beamToggle") activeScanner().cfg.beam = on;
        if (btn.id === "networkToggle") {
          state.network = on;
          commGroup.visible = on && state.activeTab === "network";
        }
        if (btn.id === "gnssToggle") {
          state.gnss = on;
          gnssGroup.visible =
            on && state.body === "earth" && state.activeTab === "gnss";
        }
        if (btn.id === "scanOverlayToggle") state.scanOverlay = on;
        if (btn.id === "flatLightToggle") {
          state.flatLight = on;
          applyLightingMode();
        }
      }),
  );
  $("resetMap").onclick = resetMap;
  document
    .querySelectorAll("[data-mapmode]")
    .forEach((x) => (x.onclick = () => setMapMode(x.dataset.mapmode)));
  $("minimizeMap").onclick = () => $("mapPanel").classList.toggle("minimized");
  $("relief").oninput = () => buildBody(state.body);
  $("exposure").oninput = () => {
    renderer.toneMappingExposure = +$("exposure").value;
    updateLabels();
  };
  $("satScale").oninput = updateLabels;
  $("stationA").onchange = () => {
    setNetworkTargets(
      selectedTargets().filter((x) => x !== $("stationA").value),
    );
  };
  $("constellation").oninput = () => {
    updateNetworkLabels();
    rebuildComm();
  };
  $("networkAlt").oninput = updateNetworkLabels;
  $("addTarget").onclick = () => {
    if ($("targetPicker").value)
      setNetworkTargets([...networkTargets, $("targetPicker").value]);
  };
  $("clearTargets").onclick = () => setNetworkTargets([]);
  document.querySelectorAll("[data-network-scenario]").forEach(
    (btn) =>
      (btn.onclick = () => {
        const sets = {
          global: [
            "jakarta",
            "sydney",
            "washington",
            "saopaulo",
            "nairobi",
            "tokyo",
          ],
          europe: ["london", "paris", "berlin", "rome", "warsaw"],
          americas: [
            "washington",
            "mexico",
            "bogota",
            "lima",
            "buenosaires",
            "saopaulo",
          ],
          asia: ["tokyo", "beijing", "seoul", "delhi", "singapore", "sydney"],
        };
        setNetworkTargets(sets[btn.dataset.networkScenario]);
      }),
  );
  $("gnssSystem").onchange = () => {
    rebuildGNSS();
    updateGNSS();
  };
  $("receiverCity").onchange = updateGNSS;
  ["elevationMask", "clockError", "atmoError", "multipath"].forEach(
    (id) =>
      ($(id).oninput = () => {
        updateGNSSLabels();
        updateGNSS();
      }),
  );
  $("play").onclick = () => {
    state.running = !state.running;
    $("play").classList.toggle("pause", state.running);
  };
  document.querySelectorAll("[data-speed]").forEach(
    (btn) =>
      (btn.onclick = () => {
        state.speed = +btn.dataset.speed;
        state.running = true;
        $("play").classList.add("pause");
        document
          .querySelectorAll("[data-speed]")
          .forEach((x) => x.classList.toggle("active", x === btn));
      }),
  );
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  renderBodySelect();
  renderCities();
  createScanner();
  rebuildComm();
  rebuildGNSS();
  updateNetworkLabels();
  updateGNSSLabels();
  buildBody("earth").then(() => requestAnimationFrame(animate));
})();
