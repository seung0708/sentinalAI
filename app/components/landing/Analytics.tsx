const Analytics = () => {
    return (
        <section id="analytics" className="mt-12 w-full scroll-mt-24">
            <div className="container mx-auto px-4">
                <h2 className="mb-8 lg:mb-12 text-3xl md:text-4xl lg:text-5xl text-center font-semibold tracking-tight">
                    Analytics Dashboard
                </h2>
                <p className="text-lg md:text-xl text-gray-200/90 text-center max-w-3xl mx-auto mb-12">
                    Get real-time insights into transaction patterns, fraud trends, and risk metrics with our intuitive analytics dashboard.
                </p>
                <div className="bg-[#112d2b]/60 rounded-xl p-4 md:p-6 lg:p-8">
                    <img
                        src="/analytics2.png"
                        alt="SentinelAI Analytics Dashboard"
                        className="w-full rounded-xl shadow-xl object-cover max-h-[700px]"
                    />
                </div>
            </div>
        </section>
    )
}

export default Analytics;