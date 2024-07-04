"use client";
import { ColorColumn } from "./columns";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger,
    DropdownMenuLabel, 
    DropdownMenuItem
} 
from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";


interface CellActionProps{
    data: ColorColumn;
}
 
export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();  

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Color Id copiado de portapapeles.")
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
            router.refresh();
            toast.success("Color Eliminado.")
        } catch(err) {
            toast.error("Asegúrese de eliminar primero todos los productos que usen este Color.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir Menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-sky-900">
                    <DropdownMenuLabel className="text-white">
                        Acción
                    </DropdownMenuLabel>
                    <DropdownMenuItem  className="text-white" onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4 "/>
                        Copiar Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)} className="text-white">
                        <Edit className="mr-2 h-4 w-4 "/>
                        Actualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem  className="text-white" onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4 "/>
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};