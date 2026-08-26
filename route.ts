import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(_:Request,{params}:{params:{file:string}}){
  const name=params.file;
  if(!/^[a-f0-9]{16}\.zip$/.test(name)) return new NextResponse("Not found",{status:404});
  try{
    const data=await fs.readFile(path.join(process.cwd(),"uploads",name));
    return new NextResponse(data,{headers:{"Content-Type":"application/zip","Content-Disposition":`attachment; filename="${name}"`,"Cache-Control":"public, max-age=31536000, immutable"}});
  }catch{return new NextResponse("Not found",{status:404});}
}