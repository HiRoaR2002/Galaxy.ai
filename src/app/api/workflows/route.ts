
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Workflow from "@/models/Workflow";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, nodes, edges } = body;

    if (!nodes || !edges) {
      return NextResponse.json(
        { error: "Invalid workflow data" },
        { status: 400 }
      );
    }

    const workflow = await Workflow.create({
      name: name || "Untitled Workflow",
      nodes,
      edges,
    });

    return NextResponse.json({ success: true, workflow }, { status: 201 });
  } catch (error: any) {
    console.error("Save Workflow Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save workflow" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const workflows = await Workflow.find({}).sort({ updatedAt: -1 }).limit(20);
        return NextResponse.json({ workflows });
    } catch (error: any) {
        console.error("Fetch Workflows Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch workflows" },
            { status: 500 }
        );
    }
}
