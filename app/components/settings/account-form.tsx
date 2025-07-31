"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Router } from "express"

const accountFormSchema = z.object({
  email: z
    .string({
        required_error: "A email is required.",
    })
    .email("Email is required"),
  password: z
    .string({
        required_error: "A password is required.",
    })
    .min(8, 'Password must contain at least 8 characters'),
  confirm_password: z.string({
    required_error: "Password must match",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {

    try {
      const response = await fetch('api/auth/updateUser', {
        method:"POST",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      });

      if(!response.ok){
        throw new Error ('Failed to login')
      }

      const result = await response.json();

      if(result.status === 200){
        console.log('Account is updated')
      } else if ( result.status ===400 ) {
        console.log(result.error)
      }
    } catch(error){
      console.log(error);
    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Email</FormLabel>
              <FormControl>
                <Input placeholder="Your Email" {...field} />
              </FormControl>
              <FormDescription>

              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your Password" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your Password" {...field} />
              </FormControl>
              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  )
}