"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Flex, Typography } from 'antd';

import { useAuthContext } from '@/context/AuthContext';
import { checkWaterBottleExists, updateBottleData } from '@/firebase/db/bottles';
import { ArrowRightOutlined, RedoOutlined } from '@ant-design/icons';

export default function PairingStep(props: { 
    wtrCode: string, 
    reset: () => void, 
    onError: (error: string) => void,
    onSuccess: () => void,
}) {
    const { user } = useAuthContext();
    const router = useRouter();

    const [minimumLoadTimePassed, setMinimumLoadTimePassed] = React.useState<boolean>(false);
    const [bottleFound, setBottleFound] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        async function checkCode(code: string): Promise<void> {
            return new Promise((resolve, reject) => {
                checkWaterBottleExists(code).then(() => {
                    resolve();
                }).catch(() => {
                    setBottleFound(false);
                    reject();
                });
            });
        }

        async function setBottleDetails(uid: string, userName: string) {
            await updateBottleData(props.wtrCode, { 
                name: `${userName}'s wtr bottle`,
                ownerID: uid 
            });
            setBottleFound(true);
            props.onSuccess();
        }

        // Minimum load of 2 secs
        setTimeout(() => {
            setMinimumLoadTimePassed(true);
        }, 1500);

        checkCode(props.wtrCode).then(() => {
            setBottleDetails(user!.uid, user!.displayName);
        });
    }, []);

    React.useEffect(() => {
        if (bottleFound === false) {
            props.onError("Non-existent bottle");
        }
    }, [minimumLoadTimePassed]);

    if (!minimumLoadTimePassed || bottleFound == null) {
        return (
            <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
                <Typography.Text style={{ fontSize: '18px' }}>Pairing your wtr bottle</Typography.Text>
                <Typography.Text style={{ fontSize: '48px' }} strong>{props.wtrCode}</Typography.Text>
            </Flex>
        );
    } else if (minimumLoadTimePassed && !bottleFound) {
        return (
            <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
                <Typography.Text style={{ fontSize: '48px' }} strong>Error</Typography.Text>
                <div style={{ height: '50px' }} />
                <Button icon={<RedoOutlined />} onClick={props.reset} type="primary" danger>
                    Try again
                </Button>
            </Flex>
        );
    } else {
        return (
            <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
                <Typography.Text style={{ fontSize: '48px' }} strong>Success!</Typography.Text>
                <div style={{ height: '50px' }} />
                <Button icon={<ArrowRightOutlined />} onClick={() => router.push('/')} type="primary">
                    Let&apos;s go!
                </Button>
            </Flex>
        );
    }
}