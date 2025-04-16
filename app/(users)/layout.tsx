export default function UserLayout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <main>
                {children}
            </main>
        </div>
    )
}