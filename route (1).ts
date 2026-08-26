import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const entry = form.get("file");
    if (!(entry instanceof File)) return NextResponse.json({error:"No file supplied."},{status:400});
    if (!entry.name.toLowerCase().endsWith(".zip")) return NextResponse.json({error:"Only ZIP files are allowed."},{status:400});
    if (entry.size > 100*1024*1024) return NextResponse.json({error:"Maximum file size is 100 MB."},{status:413});

    const bytes = Buffer.from(await entry.arrayBuffer());
    const sha1 = crypto.createHash("sha1").update(bytes).digest("hex");
    const id = crypto.randomBytes(8).toString("hex");
    const dir = path.join(process.cwd(),"uploads");
    await fs.mkdir(dir,{recursive:true});
    await fs.writeFile(path.join(dir,`${id}.zip`),bytes);

    const origin = new URL(req.url).origin;
    return NextResponse.json({url:`${origin}/r/${id}.zip`,sha1,name:entry.name,size:entry.size});
  } catch {
    return NextResponse.json({error:"Upload failed."},{status:500});
  }
}