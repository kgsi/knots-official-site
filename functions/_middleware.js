export async function onRequest(context) {
  const response = await context.next();
  
  // 404エラーの場合は直接トップページにリダイレクト
  if (response.status === 404) {
    const url = new URL(context.request.url);
    const redirectUrl = new URL('/', url.origin);
    
    return Response.redirect(redirectUrl.toString(), 302);
  }
  
  return response;
}