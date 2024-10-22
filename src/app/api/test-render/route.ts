import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const easyCorsInit = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
};

export async function GET() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  await page.setContent(`
        <html>
        <head>
        </head>
        <body>
        <div id="container">
        <script src="https://unpkg.com/konva@9/konva.min.js"></script>
        </div>
        </body>
        </html>
      `);

  await page.evaluate(() => {
    const Konva = (window as any).Konva;

    const stage = new Konva.Stage({
      container: "container",
      width: 600,
      height: 600,
      id: "canvas",
    });

    const layer = new Konva.Layer();

    const rect1 = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 50,
      fill: "green",
      stroke: "black",
      strokeWidth: 4,
    });
    // add the shape to the layer
    layer.add(rect1);

    const rect2 = new Konva.Rect({
      x: 150,
      y: 40,
      width: 100,
      height: 50,
      fill: "red",
      shadowBlur: 10,
      cornerRadius: 10,
    });
    layer.add(rect2);

    const rect3 = new Konva.Rect({
      x: 50,
      y: 120,
      width: 100,
      height: 100,
      fill: "blue",
      cornerRadius: [0, 10, 20, 30],
    });
    layer.add(rect3);

    // add the layer to the stage
    stage.add(layer);
  });

  const canvas = await page.$("canvas");
  if (!canvas) throw new Error("no canvas");
  const screenshotBuffer = await canvas.screenshot({ type: "jpeg" });

  return new NextResponse(screenshotBuffer, {
    ...easyCorsInit,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Disposition": "attachment; filename=test-render.jpg",
    },
  });
}
