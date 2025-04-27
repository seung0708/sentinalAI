"use client";

import { useRouter } from "next/navigation";
import {useState} from "react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const StripeCard = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false)

    const handleConnectStripe = async () => {
        try {
            const response = await fetch("/api/stripe/onboard", {
              method:'POST', 
              headers: {
                "Content-Type": "application/json"
              }
            })

            const {accountLink} = await response.json();
            console.log(accountLink)
            if(accountLink) {
              router.push(accountLink.url)
            }
            
        } catch (error) {

        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stripe</CardTitle>
            <CardDescription>
                Connect your Stripe account to start monitoring transactions in real time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isConnected ? "Connected" : "Not Connected"}
          </div>
          <Button onClick={handleConnectStripe}>
            {isConnected ? "Reconnect" : "Connect Stripe"}
          </Button>
        </CardContent>
      </Card>
    )
}