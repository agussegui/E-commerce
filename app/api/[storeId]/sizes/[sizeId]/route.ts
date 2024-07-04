import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"



export async function GET (
    req: Request,
    { params }: { params: { sizeId: string }}
) {
    try {
        if(!params.sizeId) {
            return new NextResponse("El id del tamaño es requerido ", { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        })

        return NextResponse.json(size);
    } catch (err) {
        console.log('[SIZE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH(
    req:Request,
    {params}: {params: {storeId: string, sizeId: string}}
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name, value} = body;

        if(!userId){
            return new NextResponse("No Autenticado", {status: 401})
        }

        if(!name){
            return new NextResponse("El nombre es requerido", {status:400})
        }

        if(!value){
            return new NextResponse("El valor es requerido", {status:400})
        }

        if(!params.sizeId){
            return new NextResponse("El Id del tamaño es requerido", {status:400})
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

        const size = await prismadb.size.updateMany({
            where:{
                id: params.sizeId,
                
            },
            data:{
                name,
                value
            }
        })

        return NextResponse.json(size)
    } catch (error) {
        console.log('[SIZE_PATCH]',error)
        return new NextResponse("Error Interno",{status: 500});
    }
}


export async function DELETE(
    req:Request,
    {params}: {params: {storeId: string, sizeId: string}}
) {
    try {
        const {userId} = auth();
        

        if(!userId){
            return new NextResponse("No Autenticado", {status: 401})
        }

        if(!params.sizeId){
            return new NextResponse("El Id del tamaño es requerido", {status:400})
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

        const size = await prismadb.size.deleteMany({
            where:{
                id: params.sizeId,
            }
        })

        return NextResponse.json(size)
    } catch (error) {
        console.log('[SIZE_DELETE]',error)
        return new NextResponse("Error Interno",{status: 500});
    }
}