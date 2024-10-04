'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

function validateEmailPassword(email: any, password: any): {valid: boolean, message: string} {

    if(!email || !password){
        return {valid: false, message: 'Email and password are required'}
    }
    if(typeof email !== 'string' || typeof password !== 'string'){
        return {valid: false, message: 'Email and password must be strings'}
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {valid: false, message: 'Invalid email format'}
    }

    const MIN_PASSWORD_LENGTH = 8;
    if (password.length < MIN_PASSWORD_LENGTH) {
        return {valid: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`}
    }
    return {valid: true, message: ''}
}

export async function login(email: string, password: string) {

    const {valid, message} = validateEmailPassword(email, password)

    if(!valid){
        throw new Error(message)
    }

    const supabase = createClient()

    // attempt login
    const { error } = await supabase.auth.signInWithPassword({email: email as string, password: password as string})

    // if login fails, return error
    if (error) {
        throw new Error('Invalid email or password')
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signup(email: string, password: string) {
    console.log("signup called")

    const {valid, message} = validateEmailPassword(email, password)

    if(!valid){
        throw new Error(message)
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({email: email as string, password: password as string})

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/signup/check-email')
}