import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import fileTraining from "@/app/actions/FileTraining";
import { Status } from "@prisma/client";

type UploadData = {
  url: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}


function toArray(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  const str = value.toString();
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [str]; // if plain string
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId")?.toString();
    if (!userId) {
      return NextResponse.json({ success: false, message: "UserId missing" }, { status: 400 });
    }
    const cloneName = formData.get("clone_name")?.toString() ?? "Untitled Clone";
    const cloneIntro = formData.get("clone_intro")?.toString() ?? "";
    const tone = toArray(formData.get("tone"));
    const style = toArray(formData.get("style"));
    const values = toArray(formData.get("values"));
    const catchphrases = toArray(formData.get("catchphrases"));
    const dos = formData.get("dos")?.toString() ?? "";
    const donts = formData.get("donts")?.toString() ?? "";
    const domain = formData.get("domain")?.toString() ?? "";
    const description = formData.get("freeform_description")?.toString() ?? "";
    const youtubeLinks = toArray(formData.get("youtubeLinkUpload"));
    const otherLinks = toArray(formData.get("otherLinkUpload"));
    const userEmail = formData.get("userEmail")?.toString();
    const imageUrl = formData.get("image") as string;
    const uploadedFiles: UploadData[] = [];
    const pdfFiles = formData.getAll("fileUploads") as File[];

    for (const pdf of pdfFiles) {
      const url = await uploadFileToCloudinary(pdf, "clone-pdfs", "raw");
      const buffer = Buffer.from(await pdf.arrayBuffer());
      let originalName = pdf.name;
      if (pdf.type === "application/pdf" && !originalName.toLowerCase().endsWith(".pdf")) {
        originalName += ".pdf";
      }

      uploadedFiles.push({
        url,
        originalName,
        mimeType: pdf.type,
        fileSize: buffer.length,
      });
    }

    // Save clone
    const newClone = await prisma.cloneProfile.create({
      data: {
        clone_id: `clone_u_${Math.random().toString(16).substring(2, 14)}`,
        user_email: userEmail || "",
        clone_name: cloneName,
        clone_intro: cloneIntro,
        tone,
        style,
        values,
        catchphrases,
        domain,
        dos,
        donts,
        freeform_description: description,
        youtubeLinkUpload: youtubeLinks,
        otherLinkUpload: otherLinks,
        image: imageUrl,
        fileUploads: { create: uploadedFiles },
        status: Status.pending,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { cloneId: newClone.clone_id },
    });

    const res = await fileTraining(newClone.clone_id);
    const data = await res.json();
    if (data.success) {
      const updatedClone = await prisma.cloneProfile.update({
        where: { clone_id: newClone.clone_id },
        data: { status: Status.live },
        include: { fileUploads: true },
      });
      return NextResponse.json({ success: true, data: updatedClone, message: "Clone create successfully and File sent for training" }, { status: 201 });
    }
    return NextResponse.json({ success: true, data: newClone, message: "Clone create successfully but failed to send files" }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clones = await prisma.cloneProfile.findMany({
      include: { fileUploads: true },
    });
    return NextResponse.json({ success: true, data: clones });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}
