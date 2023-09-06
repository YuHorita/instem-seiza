import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const { displayName, selectedStar, starLines, starName } = await request.json();

    await prisma.designStar.create({
        data: {
            displayName: displayName,
            selectedStar: selectedStar,
            starLines: starLines,
            starName: starName
        },
    });
}