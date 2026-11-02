const {createClient}=require('@supabase/supabase-js');
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return {statusCode:405,body:JSON.stringify({error:'Method not allowed'})};
 try{
  const {shop_name,email,id_number,price}=JSON.parse(event.body||'{}');
  const shops=['Xoxo Gen','Torono Masters','Get Life Update','Edu Spark Up','Digital Adventures','Skill 0 Zen','Soft Get Skills'];
  const cleanEmail=typeof email==='string'?email.trim().toLowerCase():'';
  if(!shops.includes(shop_name)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)||cleanEmail.length>254||typeof id_number!=='string'||!/^[0-9]{14,16}$/.test(id_number)||typeof price!=='string'||!/^\$[0-9,]+(?:\.[0-9]{2})?$/.test(price))return {statusCode:400,body:JSON.stringify({error:'Enter a valid email and an ID Number containing 14 to 16 digits.'})};
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw Error('Server configuration missing');
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {data,error}=await db.rpc('verify_shop_email_id',{p_shop_name:shop_name,p_email:cleanEmail,p_id_number:id_number,p_price:price});
  if(error)throw error;
  if(data!=='ok')return {statusCode:409,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:data==='duplicate_email'?'This email has already been used in this shop.':data==='duplicate_id'?'This ID Number has already been used in this shop.':'Duplicate entry.'})};
  return {statusCode:200,headers:{'Content-Type':'application/json'},body:JSON.stringify({ok:true})};
 }catch(e){console.error('Verification failed:',e.message);return {statusCode:500,body:JSON.stringify({error:'Verification service is not configured or is temporarily unavailable.'})}}
};
