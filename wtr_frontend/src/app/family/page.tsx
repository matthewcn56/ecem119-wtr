"use client"

import React from 'react';
import { Button, Divider, Flex, Modal, QRCode } from 'antd';

import { useAuthContext } from '@/context/AuthContext';
import AddFriendModal from './components/AddFriendModal';
import UserInfoCard from './components/UserInfoCard';
import FamilyInfoCards from './components/FamilyInfoCards';

export default function Family() {
    const { user } = useAuthContext();

    const [loading, setLoading] = React.useState<boolean>(true);
    const [showCodeModal, setShowCodeModal] = React.useState<boolean>(false);
    const [showAddFriendModal, setShowAddFriendModal] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (user)
            setLoading(false);
    }, [user]);

    return (<>
        <Modal
            open={showCodeModal}
            title="My Friend Code"
            onCancel={() => setShowCodeModal(false)}
            footer={[<Button key="Cancel" type="primary" onClick={() => setShowCodeModal(false)}>OK</Button>]}
        >
            <Flex style={{ width: '100%', height: '100%', padding: '25px' }} justify="center" align="center" gap="middle" vertical>
                {
                    user &&
                    <QRCode
                        errorLevel='L'
                        value={user.uid}
                    />
                }
            </Flex>
        </Modal>
        <Modal
            open={showAddFriendModal}
            title="Add A Family Member"
            onCancel={() => setShowAddFriendModal(false)}
            footer={[<Button key="Cancel" onClick={() => setShowAddFriendModal(false)}>Cancel</Button>]}
            styles={{ body: { height: '400px' }}}
        >
            <Flex style={{ width: '100%', height: '100%', padding: '25px' }} justify="center" align="center" gap="middle" vertical>
                {
                    user &&
                    <AddFriendModal user={user} closeModal={() => setShowAddFriendModal(false)} />
                }
            </Flex>
        </Modal>
        <Flex style={{ width: '100%', height: '100%', padding: '25px' }} justify="center" align="center" gap="middle" vertical>
            <UserInfoCard 
                loading={loading} 
                user={user!} 
                onAddFriend={() => setShowAddFriendModal(true)}
                onShowCode={() => setShowCodeModal(true)}
            />
            {
                user && 
                <FamilyInfoCards familyMembers={user.familyMembers ?? []} />
            }
        </Flex>
    </>);
}