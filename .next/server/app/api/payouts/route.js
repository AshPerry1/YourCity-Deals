(()=>{var a={};a.id=8495,a.ids=[8495],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:a=>{"use strict";a.exports=require("punycode")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},27910:a=>{"use strict";a.exports=require("stream")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},42791:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>F,patchFetch:()=>E,routeModule:()=>A,serverHooks:()=>D,workAsyncStorage:()=>B,workUnitAsyncStorage:()=>C});var d={};c.r(d),c.d(d,{GET:()=>x,POST:()=>y,PUT:()=>z});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641);c(82461),process.env.SUPABASE_SERVICE_ROLE_KEY;var v=c(63718),w=c(94984);async function x(a){try{!0;return new Response(JSON.stringify({error:"Database not configured"}),{status:503,headers:{"Content-Type":"application/json"}})}catch(a){return console.error("Error fetching payouts:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}async function y(a){try{let b=await a.json(),c=(0,v.PT)(b);if(!c.valid)return u.NextResponse.json({error:"Invalid payout data",details:c.errors},{status:400});b.reference_number||(b.reference_number=(0,v.$p)());let d=(0,v.vZ)(b.gross_sales_cents,b.points_rate||.5,b.fee_cents||0),e={school_id:b.school_id,school_name:b.school_name,amount_cents:d.netPayoutCents,payout_date:new Date(b.payout_date),payment_method:b.payment_method,reference_number:b.reference_number,status:"pending",description:b.description,period_start:new Date(b.period_start),period_end:new Date(b.period_end),sales_count:b.sales_count,gross_sales_cents:b.gross_sales_cents,net_payout_cents:d.netPayoutCents,fee_cents:d.feeCents,created_by:b.created_by,created_at:new Date},{data:f,error:g}=await null.from("payouts").insert(e).select().single();if(g||!f)return u.NextResponse.json({error:"Failed to create payout"},{status:500});try{(0,w.qW)(f.id,f.amount_cents,b.school_id,b.created_by),await fetch("your_supabase_project_url/api/accounting/record-event",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`},body:JSON.stringify({eventType:"payout_issued",payload:{payoutId:f.id,payoutAmountCents:f.amount_cents,schoolId:b.school_id,createdBy:b.created_by}})})}catch(a){console.error("Error recording accounting event:",a)}return u.NextResponse.json({success:!0,payout:f,message:"Payout created successfully"})}catch(a){return console.error("Error creating payout:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}async function z(a){try{let{payoutId:b,status:c,notes:d}=await a.json();if(!b||!c)return u.NextResponse.json({error:"Payout ID and status are required"},{status:400});let e={status:c};"completed"===c&&(e.completed_at=new Date().toISOString()),d&&(e.notes=d);let{data:f,error:g}=await null.from("payouts").update(e).eq("id",b).select().single();if(g||!f)return u.NextResponse.json({error:"Failed to update payout"},{status:500});return u.NextResponse.json({success:!0,payout:f,message:"Payout updated successfully"})}catch(a){return console.error("Error updating payout:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let A=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/payouts/route",pathname:"/api/payouts",filename:"route",bundlePath:"app/api/payouts/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Users/ashperry/Desktop/Coupon/app/api/payouts/route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:B,workUnitAsyncStorage:C,serverHooks:D}=A;function E(){return(0,g.patchFetch)({workAsyncStorage:B,workUnitAsyncStorage:C})}async function F(a,b,c){var d;let e="/api/payouts/route";"/index"===e&&(e="/");let g=await A.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||A.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===A.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>A.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>A.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await A.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},z),b}},l=await A.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await A.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},63718:(a,b,c)=>{"use strict";function d(a,b=.5,c=0){let e=Math.round(a*b);return{grossPayoutCents:e,feeCents:c,netPayoutCents:Math.max(0,e-c)}}function e(){let a=Date.now().toString(36),b=Math.random().toString(36).substring(2,8);return`PAY-${a.toUpperCase()}-${b.toUpperCase()}`}function f(a){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(a/100)}function g(a){let b=`${a.period_start.toLocaleDateString()} - ${a.period_end.toLocaleDateString()}`;return{receipt_number:function(a){let b=new Date().toISOString().slice(0,10).replace(/-/g,""),c=Math.random().toString(36).substring(2,6).toUpperCase();return`RCP-${a.slice(0,8)}-${b}-${c}`}(a.school_id),school_name:a.school_name,school_address:"School Address",school_contact:"School Contact",payout_date:a.payout_date,amount:f(a.amount_cents),payment_method:a.payment_method.replace("_"," ").toUpperCase(),reference_number:a.reference_number,period:b,sales_summary:{total_sales:a.sales_count,gross_amount:f(a.gross_sales_cents),fee_amount:f(a.fee_cents),net_amount:f(a.net_payout_cents)},breakdown:[{description:"Gross Sales",amount:f(a.gross_sales_cents)},{description:"Platform Fee",amount:`-${f(a.fee_cents)}`},{description:"Net Payout",amount:f(a.net_payout_cents)}],terms:["This receipt serves as proof of payment for the specified period.","All sales are subject to verification and may be adjusted for returns or disputes.","Payment processing may take 3-5 business days depending on your bank.","For questions regarding this payout, please contact our support team.","This document is generated automatically and is valid for tax purposes."],contact_info:{company_name:"YourCity Deals, LLC",address:"123 Business Street, Your City, ST 12345",phone:"(555) 123-4567",email:"payouts@yourcitydeals.com",website:"www.yourcitydeals.com"}}}function h(a){let b=`Payout Receipt - ${a.school_name} - ${a.period}`;return{subject:b,body:`
Dear ${a.school_name},

We are pleased to inform you that your payout for the period ${a.period} has been processed.

Payout Details:
- Receipt Number: ${a.receipt_number}
- Amount: ${a.amount}
- Payment Method: ${a.payment_method}
- Reference Number: ${a.reference_number}
- Period: ${a.period}

Sales Summary:
- Total Sales: ${a.sales_summary.total_sales}
- Gross Amount: ${a.sales_summary.gross_amount}
- Platform Fee: ${a.sales_summary.fee_amount}
- Net Payout: ${a.sales_summary.net_amount}

Please find attached the detailed receipt for your records.

If you have any questions, please contact us at ${a.contact_info.email} or ${a.contact_info.phone}.

Best regards,
${a.contact_info.company_name}
  `,html:`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .summary { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Payout Receipt</h1>
    <p>${a.school_name}</p>
  </div>
  
  <div class="content">
    <p>Dear ${a.school_name},</p>
    
    <p>We are pleased to inform you that your payout for the period <strong>${a.period}</strong> has been processed.</p>
    
    <div class="details">
      <h3>Payout Details:</h3>
      <ul>
        <li><strong>Receipt Number:</strong> ${a.receipt_number}</li>
        <li><strong>Amount:</strong> ${a.amount}</li>
        <li><strong>Payment Method:</strong> ${a.payment_method}</li>
        <li><strong>Reference Number:</strong> ${a.reference_number}</li>
        <li><strong>Period:</strong> ${a.period}</li>
      </ul>
    </div>
    
    <div class="summary">
      <h3>Sales Summary:</h3>
      <ul>
        <li><strong>Total Sales:</strong> ${a.sales_summary.total_sales}</li>
        <li><strong>Gross Amount:</strong> ${a.sales_summary.gross_amount}</li>
        <li><strong>Platform Fee:</strong> ${a.sales_summary.fee_amount}</li>
        <li><strong>Net Payout:</strong> ${a.sales_summary.net_amount}</li>
      </ul>
    </div>
    
    <p>Please find attached the detailed receipt for your records.</p>
    
    <p>If you have any questions, please contact us at <a href="mailto:${a.contact_info.email}">${a.contact_info.email}</a> or ${a.contact_info.phone}.</p>
    
    <p>Best regards,<br>
    <strong>${a.contact_info.company_name}</strong></p>
  </div>
  
  <div class="footer">
    <p>${a.contact_info.address} | ${a.contact_info.phone} | ${a.contact_info.website}</p>
  </div>
</body>
</html>
  `}}function i(a){let b=[];return a.school_id||b.push("School ID is required"),(!a.amount_cents||a.amount_cents<=0)&&b.push("Payout amount must be greater than 0"),a.payout_date||b.push("Payout date is required"),a.payment_method||b.push("Payment method is required"),a.reference_number||b.push("Reference number is required"),a.period_start&&a.period_end||b.push("Period start and end dates are required"),{valid:0===b.length,errors:b}}c.d(b,{$p:()=>e,KW:()=>g,PT:()=>i,e$:()=>h,vZ:()=>d})},74075:a=>{"use strict";a.exports=require("zlib")},78335:()=>{},79551:a=>{"use strict";a.exports=require("url")},81630:a=>{"use strict";a.exports=require("http")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94984:(a,b,c)=>{"use strict";c.d(b,{Fx:()=>f,Pg:()=>h,Qk:()=>e,Qz:()=>g,qW:()=>i});let d={CASH:"1000",SALES:"4000",DISCOUNTS:"4100",STRIPE_FEES:"5000",PARTNER_PAYOUTS:"5100",REFUNDS:"5200"};function e(a){let b=a.filter(a=>"debit"===a.side).reduce((a,b)=>a+b.amount_cents,0),c=a.filter(a=>"credit"===a.side).reduce((a,b)=>a+b.amount_cents,0);return b!==c?{valid:!1,error:`Debits (${b}) do not equal credits (${c})`}:{valid:!0}}function f(a,b,c,e=0,g){return{type:"purchase_successful",occurred_at:new Date,description:`Coupon book purchase ${a}`,source_id:a,created_by:g,lines:[{account_code:d.CASH,side:"debit",amount_cents:b},{account_code:d.SALES,side:"credit",amount_cents:b-c-e},...e>0?[{account_code:d.DISCOUNTS,side:"credit",amount_cents:e}]:[],{account_code:d.STRIPE_FEES,side:"credit",amount_cents:c}]}}function g(a,b,c=0,e){return{type:"refund_processed",occurred_at:new Date,description:`Refund processed ${a}`,source_id:a,created_by:e,lines:[{account_code:d.REFUNDS,side:"debit",amount_cents:b},{account_code:d.CASH,side:"credit",amount_cents:b},...c>0?[{account_code:d.STRIPE_FEES,side:"debit",amount_cents:c},{account_code:d.CASH,side:"credit",amount_cents:c}]:[]]}}function h(a,b,c){return{type:"discount_applied",occurred_at:new Date,description:`Discount applied ${a}`,source_id:a,created_by:c,lines:[{account_code:d.DISCOUNTS,side:"debit",amount_cents:b},{account_code:d.SALES,side:"credit",amount_cents:b}]}}function i(a,b,c,e){return{type:"payout_issued",occurred_at:new Date,description:`School payout ${a} to school ${c}`,source_id:a,created_by:e,lines:[{account_code:d.PARTNER_PAYOUTS,side:"debit",amount_cents:b},{account_code:d.CASH,side:"credit",amount_cents:b}]}}},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4586,3704],()=>b(b.s=42791));module.exports=c})();