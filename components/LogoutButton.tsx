'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

export default function LogoutButton(): JSX.Element {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const supabase = createClient()
    const signOut = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        router.refresh()
        setLoading(false)
    }

    return (
        <Button onClick={() => {
            signOut()
        }} className="ml-auto">
            {loading ? <Loader2 className="animate-spin" /> : 'Logout'}
        </Button>
    )
}
