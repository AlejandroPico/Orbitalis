# ORBITALIS — Earth Scan Studio

Simulador tridimensional de observación terrestre y adquisición satelital.

## Cómo abrirlo

1. Extrae por completo el archivo ZIP.
2. Conserva juntas las carpetas `assets`, `vendor` y los archivos del proyecto.
3. Abre `index.html` o ejecuta `INICIAR_ORBITALIS.bat` en Windows.

No necesita conexión a Internet: el motor 3D y todas las texturas están incluidos.

## Modelo físico

- Tierra representada mediante el elipsoide WGS-84.
- Propagación kepleriana de dos cuerpos mediante resolución iterativa de la ecuación de Kepler.
- Elementos configurables: perigeo, excentricidad, inclinación, RAAN y argumento de perigeo.
- Perturbación secular J2 opcional para la precesión del nodo y del perigeo.
- Rotación terrestre sideral mediante GMST.
- Posición solar astronómica aproximada usada simultáneamente para iluminación, terminador y representación del Sol.
- Intersección analítica del eje del sensor con el elipsoide terrestre.
- Huella y anchura de barrido obtenidas mediante los rayos extremos del campo de visión.

## Representación terrestre

- Textura diurna Blue Marble de 4096 × 2048 píxeles.
- Mapa topográfico de 2048 × 1024 aplicado como desplazamiento y relieve lumínico.
- Capa nocturna de 4096 × 2048 con ciudades visible únicamente en el hemisferio oscuro.
- Máscara oceánica especular, nubes de 4096 × 2048 y atmósfera dependiente del Sol.

La opción de relieve `×1` mantiene la proporción física aproximada. Los valores superiores exageran únicamente la altura del terreno para que montañas y cordilleras sean perceptibles a escala planetaria.

## Escala del satélite

La Tierra, la altitud, la órbita y la huella del sensor mantienen una escala común. El modelo del satélite puede ampliarse visualmente porque a tamaño físico real sería prácticamente invisible en una vista global.

