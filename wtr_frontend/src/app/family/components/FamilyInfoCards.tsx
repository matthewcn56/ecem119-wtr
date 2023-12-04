"use client"

import React from "react";
import { Avatar, Card, Divider, Flex, Skeleton, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

import IUser from "@/types/IUser";
import { getUser } from "@/firebase/db/users";
import { getWaterBottleLastSip } from "@/firebase/db/bottles";
import getConsumptionData from "@/utils/getConsumptionData";
import lastSipTimeHumanReadable from "@/utils/lastSipTimeHumanReadable";

export default function FamilyInfoCards(props: { familyMembers: string[] }) {
    const [cards, setCards] = React.useState<React.ReactElement<typeof FamilyInfoCard>[] | undefined>(undefined);
    
    React.useEffect(() => {
        async function init() {
            const familyInfoCards = (await Promise.all(
                props.familyMembers.map(async (fm) => {
                    return getUser(fm)
                        .then((user) => <FamilyInfoCard key={fm} user={user} />)
                        .catch(() => null);
                })
            )).filter((c) => c != null) as NonNullable<typeof cards>;

            setCards(familyInfoCards);
        }

        init();
    }, []);

    if (cards == undefined) {
        return (<>
            <div style={{ height: '48px' }} />
            <div style={{ width: '350px' }}>
                <Skeleton loading={true} active avatar />
            </div>
        </>);
    } else {
        return (<>
            { cards.length > 0 && <Divider>My Family</Divider> }
            { cards }
        </>);
    }
}

function FamilyInfoCard(props: { user: IUser }) {
    const { user } = props;

    const [waterConsumedToday, setWaterConsumedToday] = React.useState<number>(0);
    const [lastSip, setLastSip] = React.useState<number>(0);

    // Gets the water consumption and last sip for user
    React.useEffect(() => {
        getConsumptionData(user?.waterBottles || []).then((waterConsumed) => {
            setWaterConsumedToday(waterConsumed[0]);
        });

        _getLastSip(user?.waterBottles || []).then((lastSip) => {
            setLastSip(lastSip);
        })
    }, [user])

    return (
        <Card 
            style={{ width: 350, height: 250, boxSizing: 'border-box' }} 
            bodyStyle={{ width: '100%', height: '100%', padding: '5% 10%' }}
            loading={!user}
        >
            {
                user && 
                <>
                    <Flex style={{ width: '100%', height: '80px' }} justify="flex-start" align="center" gap="middle">
                        <Avatar
                            size={70}
                            shape="square"
                            /* Render user's avatar if available, otherwise use default icon */
                            icon={ !user.photoURL && <UserOutlined /> }
                            src={ user.photoURL && (<img src={user!.photoURL} alt="avatar" />)}
                        />
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            {user.displayName}
                        </Typography.Title>
                    </Flex>
                    <Divider />
                    <Flex style={{ width: '100%', height: 'calc(100% - 48px - 80px)' }} justify="center" align="center" gap="middle">
                        <Flex style={{ width: '40%', height: '100%' }} justify="center" align="flex-start" gap="middle" vertical>
                            <Typography.Text style={{ margin: 0 }}>Water Today</Typography.Text>
                            <Typography.Title level={3} style={{ margin: 0 }}>{waterConsumedToday} mL</Typography.Title>
                        </Flex>
                        <Flex style={{ width: '60%', height: '100%' }} justify="center" align="flex-start" gap="middle" vertical>
                            <Typography.Text style={{ margin: 0 }}>Last Sip</Typography.Text>
                            <Typography.Title level={3} style={{ margin: 0 }}>{lastSipTimeHumanReadable(lastSip, true)[0]}</Typography.Title>
                        </Flex>
                    </Flex>
                </>
            }
        </Card>
    );
}

async function _getLastSip(waterBottles: string[]): Promise<number> {
    const lastSip = (await Promise.all(
        waterBottles.map(async (wb) => {
            return getWaterBottleLastSip(wb)
                .then((lastSip) => lastSip)
                .catch(() => 0);
        })
    )).reduce(
        (latestSip, v) => Math.max(latestSip, v),
        0
    );

    return new Promise((resolve, reject) => resolve(lastSip));
}