import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}:{params:{storeId: string}}
) {
    try{
        const {userId} = auth();
        const body = await req.json(); 
        
        const {name, value} = body;

        if(!userId){
            return new NextResponse("No Autorizado", {status: 401})
        }

        if(!name){
            return new NextResponse("El nombre es requerido", {status: 400})
        }

        if(!value){
            return new NextResponse("El valor es requerido", {status: 400})
        }

        if(!params.storeId){
            return new NextResponse("El Id de la tienda es requerida", {status: 400})
        }
        
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("No Autorizado", {status: 403});
        }

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })  
        return NextResponse.json(size);


    }catch(error){
        console.log('[SIZES_POST]', error);
        return new NextResponse("Error Interno", {status: 500})
    }
}

export async function GET(
    req: Request,
    {params}:{params:{storeId: string}}
) {
    try{
        if(!params.storeId){
            return new NextResponse("El Id de la tienda es requerida", {status: 400})
        }
       
        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            },
        })  
        return NextResponse.json(sizes);


    }catch(error){
        console.log('[SIZES_GET]', error);
        return new NextResponse("Error Interno", {status: 500})
    }
}