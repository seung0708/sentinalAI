"use client";

import {useEffect, useState} from "react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const StripeCard = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStripeAccount = async () => {
      const response = await fetch("/api/stripe/status");
      const { message } = await response.json();

      if(message === 'connected') {
        setIsConnected(!isConnected)
      } 

      if (message === 'incomplete') {
        setError('Please complete the Stripe onboarding process.')
      }

    }

    fetchStripeAccount()
  },[isConnected])

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
      console.log(error)
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
      {error && (<span className="text-red-500">{error}</span>)}
    </Card>
  )
}