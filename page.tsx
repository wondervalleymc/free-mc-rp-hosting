 "use client";
import { useRef, useState } from "react";

export default function Home() {
  const input = useRef<HTMLInputElement>(null);
  const [file,setFile] = useState<File|null>(null);
  const [drag,setDrag] = useState(false);
  const [busy,setBusy] = useState(false);
  const [result,setResult] = useState<{url:string;sha1:string;name:string;size:number}|null>(null);
  const [error,setError] = useState("");

  const choose=(f?:File)=> {
    setError(""); setResult(null);
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".zip")) return setError("Only .zip resource packs are supported.");
    if (f.size > 100*1024*1024) return setError("Maximum file size is 100 MB.");
    setFile(f);
  };

  async function upload() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const fd=new FormData(); fd.append("file",file);
      const r=await fetch("/api/upload",{method:"POST",body:fd});
      const data=await r.json();
      if (!r.ok) throw new Error(data.error || "Upload failed.");
      setResult(data);
    } catch(e:any) { setError(e.message || "Upload failed."); }
    finally { setBusy(false); }
  }

  return <main>
    <nav><div className="brand"><span className="cube">◆</span> PackDrop</div><span className="badge">FREE RESOURCE PACK HOSTING</span></nav>
    <section className="hero">
      <div className="eyebrow">MINECRAFT • FAST • FREE</div>
      <h1>Host your resource pack.<br/><em>Get a URL instantly.</em></h1>
      <p className="sub">Upload your Minecraft resource pack and receive a direct download URL and SHA-1 hash. No account required.</p>

      <div className={"drop "+(drag?"drag":"")} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);choose(e.dataTransfer.files?.[0])}} onClick={()=>input.current?.click()}>
        <input ref={input} type="file" accept=".zip" hidden onChange={e=>choose(e.target.files?.[0])}/>
        <div className="uploadIcon">↑</div>
        <h2>{file ? file.name : "Drop your resource pack here"}</h2>
        <p>{file ? `${(file.size/1024/1024).toFixed(2)} MB · ready to upload` : "or click to browse · ZIP files up to 100 MB"}</p>
      </div>

      {error && <div className="error">{error}</div>}
      {file && !result && <button className="uploadBtn" onClick={e=>{e.stopPropagation();upload()}} disabled={busy}>{busy?"Uploading…":"Upload resource pack →"}</button>}

      {result && <div className="result">
        <div className="success">✓ Upload complete</div>
        <label>DIRECT DOWNLOAD URL</label><div className="copyrow"><code>{result.url}</code><button onClick={()=>navigator.clipboard.writeText(result.url)}>Copy</button></div>
        <label>SHA-1</label><div className="copyrow"><code>{result.sha1}</code><button onClick={()=>navigator.clipboard.writeText(result.sha1)}>Copy</button></div>
        <button className="again" onClick={()=>{setFile(null);setResult(null)}}>Upload another pack</button>
      </div>}
    </section>
    <footer><span>Built for Minecraft resource packs</span><span>SHA-1 verified · Direct ZIP delivery</span></footer>
  </main>
}