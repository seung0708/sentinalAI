import SignUpForm from "@/app/components/landing/signup-form"
import Link from "next/link"


const SignUpPage = () => {
    return (
        <section className="h-screen">
            <div className="flex h-full items-center justify-center">
                <div className="flex w-full max-w-md flex-col items-center gap-y-8 rounded-md bg-[#112d2b] px-6 py-12 shadow-md">
                    <div className="flex flex-col items-center gap-y-2">
                        <h1 className="text-4xl font-semibold">Signup</h1>
                        <p className="text-sm">Create an account</p>
                    </div>
                    <SignUpForm />
                    <div className="flex justify-center gap-1 text-sm">
                        <p>Already have an account?</p>
                        <Link href="/signin" className="font-medium hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignUpPage