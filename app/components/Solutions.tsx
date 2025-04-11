const Solutions = () => {
    return (
        <section id="solutions" className="w-full mt-4 md:mt-8">
            <div className="my-0 mb-auto lg:px-16">
                <h2 className="text-2xl text-center md:mb-4 sm:text-3xl md:text-4xl lg:mb-10">
                    Solutions
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                    <div className="flex flex-col overflow-clip rounded-xl md:col-span-2 md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
                        <div className="flex flex-col text-center justify-center px-6 py-2 md:px-4 md:py-6 lg:px-10 lg:py-12">
                            <h3 className="mb-3 text-xl md:mb-4 md:text-2xl lg:mb-6">
                                Real-Time Fraud Protection
                            </h3>
                            <p className="text-base md:text-lg">
                                Detect and prevent fraudulent transactions instantly using AI-driven risk analysis, behavioral scoring, and anomaly detection—reducing chargebacks and financial losses.
                            </p>
                        </div>
                        <div className="md:min-h-[24rem] lg:min-h-[28rem] xl:min-h-[32rem]">
                            <img
                                src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                                alt="Feature 1"
                                className="aspect-[16/9] h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col text-center overflow-clip rounded-xl md:col-span-2 md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
                        <div className="md:min-h-[24rem] lg:min-h-[28rem] xl:min-h-[32rem]">
                            <img
                                src="https://shadcnblocks.com/images/block/placeholder-2.svg"
                                alt="Feature 2"
                                className="aspect-[16/9] h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-col justify-center px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                            <h3 className="mb-3 text-3xl md:mb-4 md:text-2xl lg:mb-6">
                                Automated Incident Reports
                            </h3>
                            <p className="lg:text-lg">
                                Streamline fraud investigations with automated alerts, risk-based decisioning, and customizable workflows to take action on high-risk transactions faster.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col text-center overflow-clip rounded-xl md:col-span-2 md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
                        <div className="flex flex-col justify-center px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                            <h3 className="mb-3 text-3xl md:mb-4 md:text-2xl lg:mb-6">
                                Advanced Analytics and Reporting
                            </h3>
                            <p className="lg:text-lg">
                                Gain deep insights into fraud trends, risk patterns, and financial impact with interactive dashboards, custom reports, and AI-powered predictions.
                            </p>
                        </div>
                        <div className="md:min-h-[24rem] lg:min-h-[28rem] xl:min-h-[32rem]">
                            <img
                                src="https://shadcnblocks.com/images/block/placeholder-2.svg"
                                alt="Feature 2"
                                className="aspect-[16/9] h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Solutions