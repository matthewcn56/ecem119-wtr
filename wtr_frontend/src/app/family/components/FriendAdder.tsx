"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Flex, Typography } from 'antd';
import { ArrowRightOutlined, RedoOutlined } from '@ant-design/icons';

import { addUserFriend, checkUserExists } from '@/firebase/db/users';

export default function FriendAdder(props: { 
    user1: string, 
    user2: string, 
    closeModal: () => void,
    reset: () => void,
    onError: (error: string) => void,
    onSuccess: () => void,
}) {
    const router = useRouter();

    const [minimumLoadTimePassed, setMinimumLoadTimePassed] = React.useState<boolean>(false);
    const [friendFound, setFriendFound] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        async function checkUser(uid: string): Promise<void> {
            return new Promise((resolve, reject) => {
                checkUserExists(uid).then(() => {
                    resolve();
                }).catch(() => {
                    setFriendFound(false);
                    reject();
                });
            });
        }

        async function setFriendDetails(uid: string, friendUid: string) {
            await addUserFriend(uid, friendUid);
            setFriendFound(true);
        }

        // Minimum load of 2 secs
        setTimeout(() => {
            setMinimumLoadTimePassed(true);
        }, 1500);

        checkUser(props.user2).then(() => {
            setFriendDetails(props.user1, props.user2)
                .catch(() => {
                    setFriendFound(false);
                });
        });
    }, []);

    React.useEffect(() => {
        if (friendFound === null) {
            return;
        } else if (!friendFound) {
            props.onError("Non-existent bottle");
        } else {
            props.onSuccess();
        }
    }, [minimumLoadTimePassed]);

    function _cleanUp() {
        router.push('/family');
        props.reset();
        props.closeModal();
        window.location.reload();
    }

    if (!minimumLoadTimePassed || friendFound == null) {
        return (
            <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
                <Typography.Text style={{ fontSize: '18px' }}>Adding your new family member</Typography.Text>
            </Flex>
        );
    } else if (minimumLoadTimePassed && !friendFound) {
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
                <Button icon={<ArrowRightOutlined />} onClick={_cleanUp} type="primary">
                    Let&apos;s go!
                </Button>
            </Flex>
        );
    }
}