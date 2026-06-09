import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
    const { designData, imageUrl } = body;

    const customDesign = await prisma.customDesign.create({
      data: {
        userId: user.id,
        designData,
        imageUrl,
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

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        customDesigns: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.customDesigns);
  } catch (error) {
    console.error("Error fetching custom designs:", error);
    return NextResponse.json(
      { error: "Error fetching custom designs" },
      { status: 500 }
    );
  }
}
