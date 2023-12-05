"use client"

import React from 'react';
import Image from 'next/image';
import { Button, Card, Flex, Spin } from 'antd';

import signIn from '@/firebase/auth/signIn';

export default function Login(): JSX.Element {
    const [authRedirected, setAuthRedirected] = React.useState(false);

    function _handleSignIn() {
        setAuthRedirected(true);
        signIn();
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center">
                <Card 
                    style={{ width: 300, height: 400, boxSizing: 'border-box' }} 
                    bodyStyle={{ width: '100%', height: '100%', padding: '10%' }}
                >
                    <Flex style={{ width: '100%', height: '100%' }} justify="space-around" align="center" vertical>
                        {
                            authRedirected
                                ? (
                                    <Spin size="large" />
                                ) : (<>
                                    <Image src="wtr-circle.svg" width="150" height="150" alt="wtr logo" />
                                    <Button onClick={_handleSignIn}>
                                        Sign in with Google
                                    </Button>
                                </>)
                        }
                    </Flex>
                </Card>
            </Flex>
        </div>
    );
}