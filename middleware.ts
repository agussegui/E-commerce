import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, request) => {
  
  if (isProtectedRoute(request)){
    auth().protect();
  } 

  return NextResponse.next();
});

const isProtectedRoute = createRouteMatcher([
  '/',
  '/api/:path*'
]);

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};