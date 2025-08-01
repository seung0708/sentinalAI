"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

const formSchema = z.object({
    company: z.string(),
    email: z.string().email('Not a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

type FormData = z.infer<typeof formSchema>;

export default function SignUpForm() {

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema), 
        defaultValues: {
            company: '',
            email: '', 
            password: ''
        }
    });

    async function onSubmit(data: FormData) {
        try {

            
            const response = await fetch('/api/auth/signUp', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if(!response.ok) {
                throw new Error ('Failed to Sign Up')
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
                            name="company"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Company: </FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Company Name" autoComplete="company" {...field} /> 
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email: </FormLabel>
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
                                    <FormLabel>Password: </FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" autoComplete="password" {...field} /> 
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="mt-2 w-full">
                            Sign up
                        </Button>
                    </div>
                </div>
            </form>
        </Form>    
    )
}