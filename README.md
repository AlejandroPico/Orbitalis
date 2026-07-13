# Orbitalis · Laboratorio orbital

Laboratorio educativo 3D de observación planetaria, constelaciones de satélites, comunicaciones orbitales y navegación GNSS.

## Inicio en Windows

1. Descarga o clona la rama `main`.
2. Ejecuta `INICIAR_ORBITALIS.bat`.
3. El proyecto abrirá `http://127.0.0.1:8765/`.

No abras `index.html` mediante `file://`: WebGL y los mapas remotos requieren un servidor HTTP. El servidor PowerShell incluido es local. Se necesita conexión a Internet para obtener las cartografías planetarias en la primera carga.

## Laboratorios

### Constelación de observación

- De 1 a 8 satélites de escaneo simultáneos.
- Subpestaña, nombre, color y telemetría independientes por vehículo.
- Altitud, excentricidad, inclinación, RAAN, FOV y apuntamiento propios.
- Cargas útiles: multiespectral, altimetría láser, SAR, térmico, altimetría oceánica y sondeo atmosférico.
- Perfiles educativos polar, Landsat, Sentinel e ISS.
- Cobertura fusionada en un mapa 2D común.
- Capas cartográficas condicionadas por los datos auténticos disponibles para cada cuerpo; no se generan variantes mediante filtros de color.

### Comunicaciones multipunto

- De 6 a 36 satélites de comunicaciones.
- 42 ciudades agrupadas por región.
- Un origen y hasta 12 destinos simultáneos.
- Escenarios global, europeo, americano y Asia-Pacífico.
- Visibilidad por horizonte, ocultación planetaria y enlaces intersatelitales.
- Estado de cada conjunto de rutas, saltos máximos y retardo medio estimado.

### GNSS / GPS

- Perfiles GPS, Galileo y GPS + Galileo.
- Órbitas MEO, planos e inclinaciones diferenciados.
- Receptor seleccionable entre las ciudades del catálogo.
- Máscara de elevación y diagrama del cielo.
- Errores configurables de reloj, atmósfera y multitrayecto.
- Estimación educativa de GDOP y error horizontal.

### Gráficos

Control independiente de atmósfera, nubes, luces nocturnas, órbitas, rastro, relieve, exposición y escala visual de los satélites.

## Enciclopedia

El botón `i` abre una enciclopedia de 30 capítulos sobre mecánica orbital, sensores activos y pasivos, SAR, lidar, altimetría oceánica, resoluciones, cartografía, constelaciones, comunicaciones, GNSS y exploración planetaria. Incluye fórmulas, diagramas, imágenes NASA y enlaces a fuentes oficiales de NASA Earthdata, NASA Science, ESA y Navipedia.

## Catálogo celeste

Incluye los planetas principales y, además, Luna, Plutón, Ceres, Vesta, Fobos, Deimos, Ío, Europa, Ganímedes, Calisto, Titán, Encélado, Tritón y Caronte.

Las texturas visibles no son siempre mapas de elevación. Cuando no existe un DEM disponible, el relieve es una ayuda visual derivada del contraste de la cartografía y se identifica como aproximado.

## Modelo y límites

- Propagación kepleriana de dos cuerpos.
- Radios ecuatorial y polar, rotación y parámetro gravitacional por cuerpo.
- Intersección analítica del sensor con el esferoide.
- Conversión geográfica única para huella 3D, cobertura y mapa 2D.
- Geometrías y frecuencia de actualización acotadas para funcionamiento continuo.
- Las posiciones ISS y GNSS son perfiles educativos propagados por el simulador, no telemetría TLE en directo.
- El cálculo GNSS y el presupuesto de comunicaciones son modelos pedagógicos, no herramientas de ingeniería operacional.
