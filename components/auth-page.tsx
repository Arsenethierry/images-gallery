"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link';

type pageProps = {
    isNewUser: boolean;
}

const RegisterFormSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required",
    }).email("Must be a valid email address"),
    name: z.string().min(1, {
        message: "Name is required",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters",
    }),
    confirmPassword: z.string().min(1, {
        message: "Confirm Password is required",
    })
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
});

const LoginFormSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required",
    }).email("Must be a valid email address"),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters",
    }),
})

function AuthPage({ isNewUser }: pageProps) {

    const router = useRouter();
    const form = useForm<z.infer<typeof RegisterFormSchema | typeof LoginFormSchema>>({
        resolver: isNewUser ? zodResolver(RegisterFormSchema) : zodResolver(LoginFormSchema)
    })

    function onSubmit(data: z.infer<typeof RegisterFormSchema | typeof LoginFormSchema>) {
        if (isNewUser) {
            axios.post('/api/register', data)
                .then(() => toast({ title: 'User registered successfully' }))
                .catch(() => toast({ title: 'User registration failed' }))
        } else {

        }
    }
    const handleAuthSwitch = () => isNewUser ? router.push('/auth/login') : router.push('/auth/register');

    return (
        <div className='bg-[#090A15] h-[100vh]'>
            <Link href={'/'} className='absolute top-10 left-5'>
                <Image src={'/logo-no-background.png'} width={200} height={100} alt="logo" />
            </Link>
            <div className='flex justify-center h-full'>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex-col space-y-5 gap-5 w-[90vw] max-w-[772px] my-auto border border-[#4B4A4A] p-10 rounded-xl'>
                        <div className='pb-8'>
                            <h1 className='text-white text-center font-bold text-2xl md:text-3xl xl:text-5xl'>{isNewUser ? 'Register' : 'Login'}</h1>
                        </div>
                        {isNewUser && (
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your name" {...field}
                                                type='text'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isNewUser && (
                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Comfirm your Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className='pt-5'>
                            <Button type='submit' className='w-full text-white bg-[#6366F1] hover:bg-[#6366F1]'>{isNewUser ? 'Register' : 'Login'}</Button>
                        </div>
                        <div className='flex justify-center items-center gap-2'>
                            <hr className='w-full border border-[#4B4A4A]' />
                            <span className='text-zinc-500'>OR</span>
                            <hr className='w-full border border-[#4B4A4A]' />
                        </div>
                        <Button
                            onClick={() => signIn('google')}
                            variant='outline'
                            type='button'
                            className='w-full text-lg flex gap-2'>
                            <Image src={'/google-icon.png'} width={25} height={25} alt='sign in with google' />
                            Continue with Google
                        </Button>
                        <h2 className='text-white text-base text-right'>
                            {isNewUser ? "have account?" : "Don't have account?"} <span onClick={handleAuthSwitch} className='text-[#6366F1] cursor-pointer'>{isNewUser ? 'Login' : 'Register'}</span>
                        </h2>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default AuthPage;
