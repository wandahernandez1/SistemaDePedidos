import { useState, useRef, useCallback, useEffect } from "react";
import { Move, RotateCcw, Check, ZoomIn, ZoomOut } from "lucide-react";

/**
 * Editor de posición de imagen
 * Permite al usuario arrastrar y ajustar cómo se ve la imagen
 * cuando se recorta con object-cover
 */
const ImagePositionEditor = ({
  imageUrl,
  initialPosition = { x: 50, y: 50 },
  initialZoom = 100,
  onPositionChange,
  onZoomChange,
  aspectRatio = "4/3", // Aspecto del contenedor destino
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Notificar cambios de posición
  useEffect(() => {
    onPositionChange?.(position);
  }, [position, onPositionChange]);

  // Notificar cambios de zoom
  useEffect(() => {
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Convertir movimiento de píxeles a porcentaje
      // Movimiento más sensible con menos zoom
      const sensitivity = 0.15;

      setPosition((prev) => ({
        x: Math.max(0, Math.min(100, prev.x - deltaX * sensitivity)),
        y: Math.max(0, Math.min(100, prev.y - deltaY * sensitivity)),
      }));

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events para móviles
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
    });
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      const sensitivity = 0.15;

      setPosition((prev) => ({
        x: Math.max(0, Math.min(100, prev.x - deltaX * sensitivity)),
        y: Math.max(0, Math.min(100, prev.y - deltaY * sensitivity)),
      }));

      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
      });
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event listeners globales para mouse up
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const handleReset = useCallback(() => {
    setPosition({ x: 50, y: 50 });
    setZoom(100);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(200, prev + 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(100, prev - 10));
  }, []);

  return (
    <div className="space-y-3">
      {/* Preview Container */}
      <div
        ref={containerRef}
        className={`
          relative overflow-hidden rounded-xl border-2 transition-all
          ${
            isDragging
              ? "border-primary-500 cursor-grabbing"
              : "border-neutral-200 cursor-grab hover:border-primary-300"
          }
        `}
        style={{ aspectRatio }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Imagen */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{
            objectPosition: `${position.x}% ${position.y}%`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
          draggable={false}
        />

        {/* Overlay con guías */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Líneas de guía (rule of thirds) */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/50" />
            ))}
          </div>

          {/* Centro indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`
                w-12 h-12 rounded-full border-2 border-white/70 flex items-center justify-center
                transition-opacity ${isDragging ? "opacity-100" : "opacity-0"}
              `}
            >
              <Move className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Sombra interna para indicar que es arrastrable */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none rounded-xl" />
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between gap-2">
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 100}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none cursor-pointer"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4 text-neutral-600" />
          </button>
          <span className="text-xs font-medium text-neutral-500 w-12 text-center">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none cursor-pointer"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Position indicator */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-mono bg-neutral-100 px-2 py-1 rounded">
            X: {Math.round(position.x)}%
          </span>
          <span className="font-mono bg-neutral-100 px-2 py-1 rounded">
            Y: {Math.round(position.y)}%
          </span>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors border-none cursor-pointer text-xs font-medium"
          title="Restablecer posición"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Instrucciones */}
      <p className="text-xs text-neutral-400 text-center">
        Arrastra la imagen para ajustar qué parte se muestra
      </p>
    </div>
  );
};

export default ImagePositionEditor;
