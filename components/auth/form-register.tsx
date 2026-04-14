"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SignUpCredentials } from "@/lib/actions";
import { RegisterButton } from "../button";

export default function FormRegister({ classes }: { classes: { id: string, nama: string }[] }) {
        const [state, formAction] = useActionState(SignUpCredentials, null);
    return (
        <form action={formAction} className="space-y-6">
                {state?.message ? (
                    <div 
                        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100"
                        role="alert"
                    >
                        <span className="font-medium">{state?.message}</span>
                    </div>
                ): null}
                
            <div>
                <label 
                    htmlFor="name" 
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Name
                </label>
                <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5" 
                />
                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">{state?.error?.name}</span>
                </div>
            </div>
            <div>
                <label 
                    htmlFor="email" 
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Email
                </label>
                <input 
                    type="email" 
                    name="email"
                    placeholder="john.doe@gmail.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5" 
                />
                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">{state?.error?.email}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label 
                        htmlFor="nis" 
                        className="block mb-2 text-sm font-medium text-gray-900">
                        NIS
                    </label>
                    <input 
                        type="text" 
                        name="nis"
                        placeholder="12345"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5" 
                    />
                    <div aria-live="polite" aria-atomic="true">
                        <span className="text-sm text-red-500 mt-2">{state?.error?.nis}</span>
                    </div>
                </div>
                <div>
                    <label 
                        htmlFor="kelasId" 
                        className="block mb-2 text-sm font-medium text-gray-900">
                        Kelas
                    </label>
                    <select 
                        name="kelasId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5" 
                    >
                        <option value="">Pilih Kelas</option>
                        {classes.map(c => (
                           <option key={c.id} value={c.id}>{c.nama}</option>
                        ))}
                    </select>
                    <div aria-live="polite" aria-atomic="true">
                        <span className="text-sm text-red-500 mt-2">{state?.error?.kelasId}</span>
                    </div>
                </div>
            </div>
            <div>
                <label 
                    htmlFor="password" 
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Password
                </label>
                <input 
                    type="password" 
                    name="password"
                    placeholder="********"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5" 
                />
                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">{state?.error?.password}</span>
                </div>
            </div>
            <div>
                <label 
                    htmlFor="confirmPassword" 
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Confirm Password
                </label>
                <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="********"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5" 
                />
                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">{state?.error?.confirmPassword}</span>
                </div>
            </div>
            <RegisterButton />
            <p className="text-sm font-light text-gray-500">
                Already have an account?
                <Link href="/login"><span className="font-medium pl-1 text-blue-600 hover:text-blue-700">Sign In</span></Link>
            </p>
        </form>
    );
}