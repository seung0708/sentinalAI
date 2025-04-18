import SignInForm from "@/app/components/landing/signin-form";
import Link from "next/link";

const Page = () => {
    return (
        <section className="h-screen">
            <div className="flex h-full items-center justify-center">
                <div className="flex w-full max-w-md flex-col items-center gap-y-8 rounded-md bg-[#112d2b] px-6 py-12 shadow-md">
                    <div className="flex flex-col items-center gap-y-2">
                        <h1 className="text-4xl font-semibold">Sign in</h1>
                        <p className="text-sm">Welcome back!</p>
                    </div>
                    <SignInForm />
                    <div className="flex justify-center gap-1 text-sm">
                        <p>Don't have an account?</p>
                        <Link href="/signup" className="font-medium hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Page;