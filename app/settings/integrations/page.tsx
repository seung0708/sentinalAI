import { StripeCard } from "@/app/components/settings/integration-cards"

export default function IntegrationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Integrations</h3>
                <p className="text-sm text-muted-foreground">
                    Connect your external platforms to enable transactions
                </p>
            </div>
            <StripeCard />
        </div>
    )
}