"use client"

import React from 'react';

import { useAuthContext } from '@/context/AuthContext';
import Login from './Login';

export default function AuthenticatedWrapper({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext();
    console.log(user);

    return user ? children : <Login />;
}