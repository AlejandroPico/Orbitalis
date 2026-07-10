# Orbitalis SCAN

Simulador de cartografía orbital inspirado en la experiencia de SCANsat, reconstruido para trabajar con cuerpos reales del Sistema Solar.

## Inicio correcto en Windows

1. Extrae completamente el ZIP.
2. Ejecuta `INICIAR_ORBITALIS.bat`.
3. El proyecto abrirá `http://127.0.0.1:8765/` en el navegador.

No abras `index.html` directamente. Los navegadores restringen texturas WebGL cargadas mediante `file://`; esa fue la causa de la esfera negra de la versión anterior.

El servidor de la aplicación es local y está escrito en PowerShell. Se necesita conexión a Internet para descargar en la primera carga las cartografías astronómicas y las librerías 3D desde sus repositorios públicos. Para cerrarlo, termina la ventana minimizada «Orbitalis Server» o el proceso de PowerShell correspondiente.

## Funcionamiento

- El botón hamburguesa contiene configuración, telemetría y leyenda.
- El mapa 2D revela progresivamente la capa visual o de relieve.
- Cada mundo conserva su cartografía mientras la aplicación permanezca abierta.
- La cobertura, la huella 3D y el mapa 2D proceden de una única coordenada planetaria.
- El control inferior modifica solamente la aceleración temporal; no existe una duración máxima.

## Cuerpos disponibles

Mercurio, Venus, Tierra, Luna, Marte, Júpiter, Saturno, Urano, Neptuno y Plutón.

En los gigantes gaseosos y de hielo no existe una superficie sólida cartografiable. El modo «Relieve» representa estructura y contraste de las capas nubosas, no montañas.

## Modelo

- Órbita kepleriana elíptica.
- Pericentro, excentricidad, inclinación y RAAN configurables.
- Radios ecuatoriales y polares independientes.
- Parámetro gravitacional y rotación específicos de cada cuerpo.
- Intersección analítica del sensor con el esferoide planetario.
- Campo de visión y orientación lateral del sensor.
- Memoria de rastro y geometría acotadas para funcionamiento indefinido.
