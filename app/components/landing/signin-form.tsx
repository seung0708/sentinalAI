"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { useState } from "react";


const formSchema = z.object({
    email: z.string().email('Not a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

type FormData = z.infer<typeof formSchema>;

export default function SignInForm() {
    const [error, setError] = useState('');
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema), 
        defaultValues: {
            email: '', 
            password: ''
        }
    });

    async function onSubmit(data: FormData) {
        try {
            const response = await fetch('/api/auth/signIn', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if(!response.ok) {
                throw new Error ('Failed to login')
            }

            const result = await response.json();
            if(result.status === 200) {
                router.push('/dashboard')
            } else if (result.status === 400) {
                setError(result.dbError)
            }

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-base">Email: </FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" autoComplete="email" {...field} /> 
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-base">Password: </FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" autoComplete="password" {...field} /> 
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {error && (<span className="text-red-500">{error}</span>)}
                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="mt-2 w-full text-base">
                            Sign in
                        </Button>
                    </div>
                </div>
            </form>
        </Form>    
    )
}