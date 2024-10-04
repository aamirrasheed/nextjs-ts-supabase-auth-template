'use client'
import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/actions"
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        try {
            await login(email, password)
        } catch (error) {
            console.error("Error when logging in", error)
        }
        setLoading(false)
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto mt-5">
            <Input type="email" name="email" placeholder="Email" />
            <Input type="password" name="password" placeholder="Password" />
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Login'}</Button>
        </form>
        <p className="mt-2">No account? <Link className="text-blue-400" href="/signup">Sign up</Link> instead</p>
        </div>
    )
}