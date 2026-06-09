/**
 * Island Gyal™ — ProductCustomizer Component
 * 
 * Fabric.js Interactive Product Designer
 */

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================
export type ProductType = "bikini" | "onepiece" | "waistbag" | "tumbler";
export type PatternType = "solid" | "stripes" | "polka" | "palm" | "floral" | "tie-dye";

interface ProductConfig {
  id: ProductType;
  name: string;
  emoji: string;
  price: number;
  colors: string[];
}

const PRODUCTS: ProductConfig[] = [
  { id: "bikini", name: "Island Flare Bikini", emoji: "🩱", price: 89, colors: ["#FF4D8D", "#17D8D1", "#FF914D"] },
  { id: "onepiece", name: "Turquoise Dream One-Piece", emoji: "👙", price: 109, colors: ["#17D8D1", "#FF4D8D", "#0A1628"] },
  { id: "waistbag", name: "Gold Rush Waist Bag", emoji: "👜", price: 49, colors: ["#D4AF37", "#FF4D8D", "#0A1628"] },
  { id: "tumbler", name: "Tropical Sipper Tumbler", emoji: "🥤", price: 34, colors: ["#FF914D", "#FF4D8D", "#17D8D1"] },
];

const COLOR_SWATCHES = [
  "#FF4D8D", "#17D8D1", "#FF914D", "#D4AF37", "#0A1628",
  "#FFFFFF", "#FF6B9D", "#0D9488", "#7C3AED", "#F59E0B",
];

const PATTERNS: { id: PatternType; label: string }[] = [
  { id: "solid", label: "⬛" },
  { id: "stripes", label: "〰️" },
  { id: "polka", label: "🔴" },
  { id: "palm", label: "🌴" },
  { id: "floral", label: "🌺" },
  { id: "tie-dye", label: "🌈" },
];

// ============================================================
// COMPONENT
// ============================================================
export default function ProductCustomizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const canvasInstanceRef = useRef<any>(null);
  const baseRectRef = useRef<any>(null);
  const patternObjectsRef = useRef<any[]>([]);
  const textObjectsRef = useRef<any[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<ProductType>("bikini");
  const [currentColor, setCurrentColor] = useState("#FF4D8D");
  const [currentPattern, setCurrentPattern] = useState<PatternType>("solid");
  const [textValue, setTextValue] = useState("Island Gyal");
  const [fontSize, setFontSize] = useState(28);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // ==================== INIT FABRIC ====================
  useEffect(() => {
    // Dynamic import for SSR safety
    const initFabric = async () => {
      const fabric = (await import("fabric")).fabric;
      fabricRef.current = fabric;

      if (!canvasRef.current) return;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 500,
        height: 600,
        backgroundColor: "#FFF8F0",
        selection: true,
        preserveObjectStacking: true,
      });

      canvasInstanceRef.current = canvas;

      // Selection events
      canvas.on("selection:created", updateCount);
      canvas.on("selection:updated", updateCount);
      canvas.on("selection:cleared", () => setObjectCount(0));

      canvas.on("object:modified", (e: any) => {
        if (e.target?.isType === "i-text") {
          setFontSize(e.target.fontSize);
        }
      });

      // Draw initial product
      drawBaseProduct("bikini", "#FF4D8D");

      // Add initial text
      setTimeout(() => addInitialText(), 200);
    };

    initFabric();

    return () => {
      canvasInstanceRef.current?.dispose();
    };
  }, []);

  // ==================== DRAW BASE PRODUCT ====================
  const drawBaseProduct = useCallback(
    (product: ProductType, color: string) => {
      const fabric = fabricRef.current;
      const canvas = canvasInstanceRef.current;
      if (!fabric || !canvas) return;

      if (baseRectRef.current) canvas.remove(baseRectRef.current);

      let shape;

      switch (product) {
        case "bikini":
          shape = new fabric.Group(
            [
              new fabric.Triangle({ width: 120, height: 100, fill: color, left: 120, top: 100 }),
              new fabric.Triangle({ width: 120, height: 100, fill: color, left: 260, top: 100 }),
              new fabric.Triangle({ width: 180, height: 100, fill: color, left: 160, top: 300, angle: 180 }),
              new fabric.Rect({ width: 4, height: 60, fill: color, left: 135, top: 40, rx: 2 }),
              new fabric.Rect({ width: 4, height: 60, fill: color, left: 260, top: 40, rx: 2 }),
            ],
            { selectable: false, evented: false }
          );
          break;

        case "onepiece":
          shape = new fabric.Group(
            [
              new fabric.Rect({ width: 200, height: 350, fill: color, left: 150, top: 60, rx: 30, ry: 30 }),
              // Neckline cutout
              new fabric.Rect({ width: 60, height: 50, fill: "#FFF8F0", left: 220, top: 70, rx: 8, ry: 8 }),
            ],
            { selectable: false, evented: false }
          );
          break;

        case "waistbag":
          shape = new fabric.Group(
            [
              new fabric.Rect({ width: 220, height: 120, fill: color, left: 140, top: 240, rx: 16, ry: 16 }),
              new fabric.Circle({ radius: 16, fill: "#D4AF37", left: 235, top: 292 }),
              new fabric.Rect({ width: 60, height: 8, fill: color, left: 95, top: 295, rx: 4 }),
              new fabric.Rect({ width: 60, height: 8, fill: color, left: 345, top: 295, rx: 4 }),
            ],
            { selectable: false, evented: false }
          );
          break;

        case "tumbler":
          shape = new fabric.Group(
            [
              new fabric.Rect({ width: 120, height: 200, fill: color, left: 190, top: 140, rx: 16, ry: 16 }),
              new fabric.Rect({ width: 130, height: 20, fill: "#C0C0C0", left: 185, top: 120, rx: 8, ry: 8 }),
              new fabric.Rect({ width: 40, height: 80, fill: color, left: 310, top: 190, rx: 12, ry: 12 }),
            ],
            { selectable: false, evented: false }
          );
          break;
      }

      if (shape) {
        baseRectRef.current = shape;
        canvas.add(shape);
        canvas.renderAll();
      }
    },
    []
  );

  // ==================== APPLY PATTERN ====================
  const applyPattern = useCallback((pattern: PatternType) => {
    const fabric = fabricRef.current;
    const canvas = canvasInstanceRef.current;
    if (!fabric || !canvas) return;

    // Clear previous patterns
    patternObjectsRef.current.forEach((obj: any) => canvas.remove(obj));
    patternObjectsRef.current = [];

    if (pattern === "solid") {
      canvas.renderAll();
      return;
    }

    const baseX = 150, baseY = 60, areaW = 200, areaH = 350;
    const count = pattern === "stripes" ? 12 : 8;

    for (let i = 0; i < count; i++) {
      let obj;
      switch (pattern) {
        case "stripes":
          obj = new fabric.Rect({
            width: areaW - 40, height: 4,
            fill: "rgba(255,255,255,0.2)",
            left: baseX + 20, top: baseY + 20 + i * 28,
            rx: 2, selectable: false, evented: false,
          });
          break;
        case "polka":
          obj = new fabric.Circle({
            radius: 6 + (i % 3) * 4,
            fill: "rgba(255,255,255,0.25)",
            left: baseX + 30 + ((i * 35) % (areaW - 60)),
            top: baseY + 30 + Math.floor(i / 3) * 50,
            selectable: false, evented: false,
          });
          break;
        case "palm":
          obj = new fabric.Text("🌴", {
            fontSize: 18 + (i % 3) * 6,
            left: baseX + (i * 40) % (areaW - 40),
            top: baseY + 30 + Math.floor(i / 3) * 60,
            selectable: false, evented: false,
            opacity: 0.25,
          });
          break;
        case "floral":
          obj = new fabric.Text("🌺", {
            fontSize: 16 + (i % 3) * 4,
            left: baseX + 20 + (i * 50) % (areaW - 50),
            top: baseY + 20 + Math.floor(i / 2) * 45,
            selectable: false, evented: false,
            opacity: 0.2,
          });
          break;
        case "tie-dye":
          obj = new fabric.Circle({
            radius: 30 + (i % 4) * 15,
            fill: `hsla(${i * 45}, 70%, 60%, 0.12)`,
            left: baseX + 20 + (i * 60) % (areaW - 40),
            top: baseY + 20 + Math.floor(i / 3) * 70,
            selectable: false, evented: false,
          });
          break;
      }
      if (obj) {
        patternObjectsRef.current.push(obj);
        canvas.add(obj);
      }
    }
    canvas.renderAll();
  }, []);

  // ==================== ADD TEXT ====================
  const addText = useCallback(
    (text?: string, size?: number, bold?: boolean, italic?: boolean) => {
      const fabric = fabricRef.current;
      const canvas = canvasInstanceRef.current;
      if (!fabric || !canvas) return;

      const t = text || textValue;
      const s = size || fontSize;

      const textObj = new fabric.IText(t, {
        left: 50 + Math.random() * 200,
        top: 50 + Math.random() * 250,
        fontFamily: "Playfair Display",
        fontSize: s,
        fill: "#0A1628",
        fontWeight: bold || isBold ? "bold" : "normal",
        fontStyle: italic || isItalic ? "italic" : "normal",
        padding: 8,
        cornerSize: 8,
        transparentCorners: false,
        cornerColor: "#FF4D8D",
        cornerStrokeColor: "#FF4D8D",
        borderColor: "#FF4D8D",
      });

      textObjectsRef.current.push(textObj);
      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      canvas.renderAll();
      updateCount();
    },
    [textValue, fontSize, isBold, isItalic]
  );

  const addInitialText = useCallback(() => {
    const fabric = fabricRef.current;
    const canvas = canvasInstanceRef.current;
    if (!fabric || !canvas) return;

    const textObj = new fabric.IText("Island Gyal", {
      left: 180, top: 430,
      fontFamily: "Playfair Display",
      fontSize: 28,
      fill: "#FF4D8D",
      fontWeight: "bold",
      padding: 8,
      cornerSize: 8,
      transparentCorners: false,
      cornerColor: "#FF4D8D",
      borderColor: "#FF4D8D",
    });
    textObjectsRef.current.push(textObj);
    canvas.add(textObj);
    canvas.renderAll();
    updateCount();
  }, []);

  // ==================== HELPERS ====================
  const updateCount = () => {
    setObjectCount(canvasInstanceRef.current?.getObjects().length || 0);
  };

  const handleProductChange = (product: ProductType) => {
    setSelectedProduct(product);
    drawBaseProduct(product, currentColor);
    applyPattern(currentPattern);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    drawBaseProduct(selectedProduct, color);
    applyPattern(currentPattern);
  };

  const handlePatternChange = (pattern: PatternType) => {
    setCurrentPattern(pattern);
    applyPattern(pattern);
  };

  const handleDeleteSelected = () => {
    const canvas = canvasInstanceRef.current;
    const active = canvas?.getActiveObject();
    if (active) {
      textObjectsRef.current = textObjectsRef.current.filter((t: any) => t !== active);
      canvas.remove(active);
      canvas.renderAll();
      updateCount();
    }
  };

  const handleBringForward = () => {
    const active = canvasInstanceRef.current?.getActiveObject();
    if (active) { canvasInstanceRef.current?.bringForward(active); canvasInstanceRef.current?.renderAll(); }
  };

  const handleSendBackward = () => {
    const active = canvasInstanceRef.current?.getActiveObject();
    if (active) { canvasInstanceRef.current?.sendBackwards(active); canvasInstanceRef.current?.renderAll(); }
  };

  const handleCenter = () => {
    const active = canvasInstanceRef.current?.getActiveObject();
    if (active) { active.center(); canvasInstanceRef.current?.renderAll(); }
  };

  const handleClearText = () => {
    const canvas = canvasInstanceRef.current;
    textObjectsRef.current.forEach((t: any) => canvas?.remove(t));
    textObjectsRef.current = [];
    canvas?.renderAll();
    updateCount();
  };

  const handleReset = () => {
    handleClearText();
    patternObjectsRef.current.forEach((obj: any) => canvasInstanceRef.current?.remove(obj));
    patternObjectsRef.current = [];
    setCurrentColor("#FF4D8D");
    setCurrentPattern("solid");
    drawBaseProduct(selectedProduct, "#FF4D8D");
  };

  const handleDownload = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `island-gyal-design-${Date.now()}.png`;
    link.href = canvas.toDataURL({ format: "png", multiplier: 2 });
    link.click();
  };

  const handleSaveDesign = async () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    setIsSaving(true);
    const dataURL = canvas.toDataURL({ format: "png", multiplier: 2 });

    try {
      const res = await fetch("/api/designs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataURL,
          product: selectedProduct,
          color: currentColor,
          pattern: currentPattern,
          textCount: textObjectsRef.current.length,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Design saved! ID: ${data.id}`);
      } else {
        alert(`❌ Failed to save design: ${data.error}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save design due to a network error");
    } finally {
      setIsSaving(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="flex min-h-screen bg-tropical-cream">
      {/* Left Panel — Product Selection */}
      <aside className="w-[280px] bg-white border-r border-gray-100 p-6 overflow-y-auto">
        <h2 className="font-playfair text-lg font-semibold mb-5">Choose Product</h2>
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleProductChange(p.id)}
            className={`w-full text-left p-4 rounded-xl mb-3 transition-all ${
              selectedProduct === p.id
                ? "border-2 border-brand-pink bg-pink-50"
                : "border-2 border-transparent bg-tropical-cream hover:border-brand-turquoise"
            }`}
          >
            <span className="text-3xl block mb-2">{p.emoji}</span>
            <div className="font-semibold text-sm">{p.name}</div>
            <div className="font-dmsans text-base text-brand-pink mt-1">${p.price}.00</div>
          </button>
        ))}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs opacity-50 mb-2">Objects: {objectCount}</p>
          <p className="text-xs opacity-30">Click objects to select</p>
        </div>
      </aside>

      {/* Center — Canvas */}
      <main className="flex-1 flex items-center justify-center p-8 relative">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-tropical-sand">
          <canvas ref={canvasRef} width={500} height={600} />
        </div>
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs opacity-30 pointer-events-none">
          ✨ Drag & drop · Click to select · Double-click text to edit
        </p>
      </main>

      {/* Right Panel — Controls */}
      <aside className="w-[320px] bg-white border-l border-gray-100 p-6 overflow-y-auto">
        {/* Colors */}
        <section className="mb-7">
          <h3 className="text-xs uppercase tracking-widest opacity-40 font-semibold mb-3">Colors</h3>
          <div className="grid grid-cols-5 gap-2">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                  currentColor === color ? "border-navy-900" : "border-transparent"
                }`}
                style={{ background: color, border: color === "#FFFFFF" ? "1px solid #ddd" : undefined }}
              >
                {currentColor === color && (
                  <span className="flex items-center justify-center text-white text-sm font-bold drop-shadow-sm">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Patterns */}
        <section className="mb-7">
          <h3 className="text-xs uppercase tracking-widest opacity-40 font-semibold mb-3">Patterns</h3>
          <div className="grid grid-cols-3 gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePatternChange(p.id)}
                className={`aspect-square rounded-lg border-2 bg-tropical-cream flex items-center justify-center text-2xl transition-all ${
                  currentPattern === p.id ? "border-brand-pink" : "border-transparent hover:border-brand-turquoise"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* Text */}
        <section className="mb-7">
          <h3 className="text-xs uppercase tracking-widest opacity-40 font-semibold mb-3">Text Overlay</h3>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-inter focus:border-brand-turquoise focus:ring-2 focus:ring-teal-100 outline-none"
              placeholder="Type here..."
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-dmsans">A</span>
              <input
                type="range"
                min={14}
                max={72}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 accent-brand-pink"
              />
              <span className="text-lg font-dmsans">A</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addText()}
                className="flex-1 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-brand-pink hover:text-brand-pink transition-colors font-inter"
              >
                + Add Text
              </button>
              <button
                onClick={() => setIsBold(!isBold)}
                className={`px-3 py-2 text-xs font-medium border rounded-lg transition-colors ${
                  isBold ? "bg-pink-50 border-brand-pink text-brand-pink" : "border-gray-200"
                }`}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`px-3 py-2 text-xs font-medium border rounded-lg transition-colors ${
                  isItalic ? "bg-pink-50 border-brand-pink text-brand-pink" : "border-gray-200"
                }`}
              >
                <em>I</em>
              </button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mb-7">
          <h3 className="text-xs uppercase tracking-widest opacity-40 font-semibold mb-3">Actions</h3>
          <div className="grid grid-cols-2 gap-2 font-inter">
            <button onClick={handleDeleteSelected} className="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-brand-pink hover:text-brand-pink transition-colors">
              🗑️ Delete
            </button>
            <button onClick={handleBringForward} className="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-brand-pink hover:text-brand-pink transition-colors">
              ⬆️ Forward
            </button>
            <button onClick={handleSendBackward} className="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-brand-pink hover:text-brand-pink transition-colors">
              ⬇️ Backward
            </button>
            <button onClick={handleCenter} className="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-brand-pink hover:text-brand-pink transition-colors">
              🎯 Center
            </button>
            <button onClick={handleClearText} className="px-3 py-2.5 text-xs font-medium border border-red-200 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors col-span-2">
              ✕ Clear All Text
            </button>
          </div>
        </section>

        {/* Save/Download buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={handleSaveDesign} 
            disabled={isSaving}
            className="flex-1 bg-brand-pink text-white font-semibold text-sm py-3 px-6 rounded-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "💾 Save Design"}
          </button>
          <button onClick={handleReset} className="px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
            Reset
          </button>
          <button onClick={handleDownload} className="px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
            📥
          </button>
        </div>
      </aside>
    </div>
  );
}
