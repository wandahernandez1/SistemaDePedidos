import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../src/assets/logo.png");
const outputPath = path.join(__dirname, "../public/index.png");

async function makeCircularFavicon() {
  try {
    const circleSize = 512; // Tamaño final del favicon
    const borderWidth = 20; // Borde más grueso para que sea notable
    const innerSize = circleSize - borderWidth * 2;

    // Crear máscara circular para la imagen
    const circleMask = Buffer.from(
      `<svg width="${innerSize}" height="${innerSize}">
        <circle cx="${innerSize / 2}" cy="${innerSize / 2}" r="${
        innerSize / 2
      }" fill="white"/>
      </svg>`
    );

    // Procesar imagen con máscara circular
    const circularImage = await sharp(inputPath)
      .resize(innerSize, innerSize, {
        fit: "cover",
        position: "center",
      })
      .composite([
        {
          input: circleMask,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    // Crear fondo con borde y sombra
    const backgroundWithBorder = Buffer.from(
      `<svg width="${circleSize}" height="${circleSize}">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Sombra -->
        <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${
        circleSize / 2 - 8
      }" fill="#2389ee" filter="url(#shadow)"/>
        <!-- Borde exterior azul -->
        <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${
        circleSize / 2 - 4
      }" fill="#2389ee"/>
        <!-- Borde blanco interior -->
        <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${
        circleSize / 2 - borderWidth
      }" fill="white"/>
      </svg>`
    );

    // Combinar fondo con imagen circular
    await sharp(backgroundWithBorder)
      .composite([
        {
          input: circularImage,
          top: borderWidth,
          left: borderWidth,
        },
      ])
      .png()
      .toFile(outputPath);

    console.log(
      "✅ Favicon circular con borde creado exitosamente en:",
      outputPath
    );
  } catch (error) {
    console.error("❌ Error al crear favicon:", error);
    process.exit(1);
  }
}

makeCircularFavicon();
