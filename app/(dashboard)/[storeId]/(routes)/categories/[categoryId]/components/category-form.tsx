"use client"
import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams,useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} 
from "@/components/ui/select";

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({initialData, billboards}) => {
    const params = useParams()
    const router = useRouter()
    
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar Categoria" : "Crear Categoria"
    const description = initialData ? "Editar Categoria" : "Agregar un nueva Categoria"
    const toastMessage = initialData ? "Categoria Actualizada" : "Categoria Creada."
    const action = initialData ? "Guardar Cambios" : "Crear "


    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    })

    const onSubmit = async (data: CategoryFormValues) =>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Algo salio mal.")
        } finally{
            setLoading(false)
        }
    }
    
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Categoria Eliminada.")
        } catch(err) {
            toast.error("Asegúrese de eliminar todos los productos que usan esta categoría primero.");
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
            <div className="flex justify-between items-center">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)} 
                    >
                        <Trash className="h-4 w-full"/>
                    </Button>
                )}
            </div>
            <Separator/>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre de la Categoria" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                                
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Cartelera</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue defaultValue={field.value} placeholder="Selecciona la Cartelera"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id}
                                                >
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                                
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
            
        </>
    )
}