const express=require("express"),cors=require("cors"),fs=require("fs"),path=require("path");
const app=express();app.use(cors());app.use(express.json({limit:"1mb"}));
const DB=path.join(__dirname,"data.json");const TOKEN=(process.env.ADMIN_TOKEN||"").trim();
function read(){return JSON.parse(fs.readFileSync(DB,"utf8"))} function write(x){fs.writeFileSync(DB,JSON.stringify(x,null,2))}
function getToken(req){const a=String(req.headers.authorization||"");if(a.toLowerCase().startsWith("bearer "))return a.slice(7).trim();return String(req.headers["x-admin-token"]||"").trim()}
function auth(req,res,next){if(!TOKEN)return res.status(500).json({error:"ADMIN_TOKEN is not configured on server"});if(getToken(req)!==TOKEN)return res.status(401).json({error:"Unauthorized"});next()}
app.get("/",(req,res)=>res.json({service:"IPO Mitra API",status:"online"}));app.get("/api/health",(req,res)=>res.json({ok:true}));app.get("/api/content",(req,res)=>res.json(read()));app.get("/api/auth-test",auth,(req,res)=>res.json({ok:true}));
app.put("/api/content",auth,(req,res)=>{let old=read(),x={content:req.body.content||old.content,ipos:Array.isArray(req.body.ipos)?req.body.ipos:old.ipos,learn:Array.isArray(req.body.learn)?req.body.learn:old.learn};write(x);res.json({ok:true,data:x})});
const PORT=process.env.PORT||3000;app.listen(PORT,"0.0.0.0",()=>console.log("IPO Mitra API "+PORT));
