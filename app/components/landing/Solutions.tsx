const Solutions = () => {
    return (
        <section id="solutions" className="mt-12 w-full scroll-mt-24">
            <div className="container mx-auto px-4">
                <h2 className="mb-8 lg:mb-12 text-3xl md:text-4xl lg:text-5xl text-center font-semibold tracking-tight">
                    Solutions
                </h2>
                <div className="space-y-8 md:space-y-12 lg:space-y-16">
                    <div className="text-center bg-[#112d2b]/60 overflow-hidden rounded-xl md:grid md:grid-cols-2 md:gap-8">
                        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
                                Real-Time Fraud Protection
                            </h3>
                            <p className="text-lg md:text-xl text-gray-200/90">
                                Detect and prevent fraudulent transactions instantly using AI-driven risk analysis, behavioral scoring, and anomaly detection—reducing chargebacks and financial losses.
                            </p>
                        </div>
                        <div className="relative h-64 md:h-auto">
                            <img
                                src="/fraud.png"
                                alt="Real-time fraud protection visualization"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <div className="text-center bg-[#112d2b]/60 overflow-hidden rounded-xl md:grid md:grid-cols-2 md:gap-8">
                        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12 md:order-2">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
                                Automated Incident Reports
                            </h3>
                            <p className="text-lg md:text-xl text-gray-200/90">
                                Streamline fraud investigations with automated alerts, risk-based decisioning, and customizable workflows to take action on high-risk transactions faster.
                            </p>
                        </div>
                        <div className="relative h-64 md:h-auto md:order-1">
                            <img
                                src="/reports.png"
                                alt="Automated incident reports dashboard"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <div className="text-center bg-[#112d2b]/60 overflow-hidden rounded-xl md:grid md:grid-cols-2 md:gap-8">
                        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
                                Advanced Analytics and Reporting
                            </h3>
                            <p className="text-lg md:text-xl text-gray-200/90">
                                Gain deep insights into fraud trends, risk patterns, and financial impact with interactive dashboards, custom reports, and AI-powered predictions.
                            </p>
                        </div>
                        <div className="relative h-64 md:h-auto">
                            <img
                                src="/analytics.png"
                                alt="Advanced analytics dashboard"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Solutions