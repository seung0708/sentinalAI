"use client";

import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const StripeCard = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false)
  const [currentlyDue, setCurrentlyDue] = useState<string[]>([])
  const [pastDue, setPastDue] = useState<any[]>([])
  const [disabledReason, setDisabledReason] = useState(null)
  const [chargesEnabled, setChargesEnabled] = useState(false); 
  const [payoutsEnabled, setPayoutsEnabled] = useState(false)

  useEffect(() => {
    const fetchStripeAccount = async () => {
      const response = await fetch("/api/stripe/status");
      const {currently_due, past_due, disabled_reason, charges_enabled, payouts_enabled} = await response.json();
      
      console.log(currently_due, past_due, disabled_reason, charges_enabled, payouts_enabled)

      if(currently_due.length === 0 && past_due.length === 0 && !disabled_reason && charges_enabled && payouts_enabled) {
        setIsConnected(!isConnected)
      } else {
        setCurrentlyDue(prev => [...prev, ...currently_due])
        setPastDue(prev => [...prev, past_due]);
        setDisabledReason(disabledReason);
        
      }

    }

    fetchStripeAccount()
  },[])

    const handleConnectStripe = async () => {
        try {
            const response = await fetch("/api/stripe/onboard", {
              method:'POST', 
              headers: {
                "Content-Type": "application/json"
              }
            })

            const {accountLink} = await response.json();
            
            if(accountLink) {
              window.location.href = accountLink.url;
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
