import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {z} from "zod";

import Link from "next/link"

const formSchema = z.object({
    email: z.string().email('Not a valid email address'),
    password: z.string().min(8, 'Password must be at least 6 characters')
})

type FormData = z.infer<typeof formSchema>;

export default function SignIn() {
    return (
        <div className="flex w-full max-w-md flex-col items-center gap-y-8 rounded-md bg-[#112d2b] px-6 py-12 shadow-md">
            <div className="flex flex-col items-center gap-y-2">
                <h1 className="text-4xl font-semibold">Sign in</h1>
                <p className="text-sm">Welcome back!</p>
            </div>
            <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Email: </Label>
                        <Input
                            type="email"
                            placeholder="Email"
                            required
                            className="bg-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Password: </Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            required
                            className="bg-white"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="mt-2 w-full">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-1 text-sm">
                <p>Don't have an account?</p>
                <Link href="/signup" className="font-medium hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    )
}