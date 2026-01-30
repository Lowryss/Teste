export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                {/* Logo/Brand Area (can be added here) */}

                {children}
            </div>
        </div>
    )
}
