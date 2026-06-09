import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { image, product, color, pattern, textCount } = body;

    if (!image) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Upload base64 image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "island-gyal/custom-designs",
    });

    const customDesign = await prisma.customDesign.create({
      data: {
        userId: user.id,
        imageUrl: uploadResponse.secure_url,
        designData: {
          product,
          color,
          pattern,
          textCount,
        },
      },
    });

    return NextResponse.json(customDesign, { status: 201 });
  } catch (error) {
    console.error("Error saving custom design:", error);
    return NextResponse.json(
      { error: "Error saving custom design" },
      { status: 500 }
    );
  }
}
