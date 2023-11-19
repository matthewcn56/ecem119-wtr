"use client"

import React from 'react';
import { Avatar, Badge, Card, Divider, Flex, Space, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, CalendarOutlined } from '@ant-design/icons';
import { Liquid } from '@ant-design/plots';

import { useAuthContext } from '@/context/AuthContext';
import { attachBottleHandler } from '@/firebase/db/bottles';
import IBottleData from '@/types/IBottleData';

export default function Home() {
    const { user } = useAuthContext();

    const [loading, setLoading] = React.useState<boolean>(true);
    const [currentBottle, setCurrentBottle] = React.useState<string | undefined>(undefined)
    const [bottleData, setBottleData] = React.useState<IBottleData | null>(null);

    // Make sure user exists and select first water bottle in list
    React.useEffect(() => {
        setLoading(true);

        if (!user)
            return;

        // Get user's water bottle
        if (!user.waterBottles || user.waterBottles.length == 0) {
            setLoading(false);
            setBottleData(null);
        }

        setCurrentBottle(user.waterBottles[0]);
    }, [user]);

    // Load data for current water bottle
    React.useEffect(() => {
        setLoading(true);

        if (!currentBottle)
            return;

        attachBottleHandler(
            currentBottle,
            (newBottleData) => {
                setLoading(false);
                setBottleData(newBottleData);
            }
        );
    }, [currentBottle]);

    return (
        <Flex style={{ width: '100%', height: '100%', padding: '25px' }} justify="center" align="center" gap="middle" vertical>
            <Card 
                style={{ width: 400, height: 400, boxSizing: 'border-box' }} 
                bodyStyle={{ width: '100%', height: '100%', padding: '10%' }}
                loading={loading}
            >   
                { bottleData &&
                    <Space direction='vertical' style={{ display: 'flex', flex: 'space-around' }}>
                        <Card.Meta
                            title={bottleData!.name}
                        />
                        <Liquid 
                            percent={bottleData!.currentWaterVolume}
                            height={300}
                            statistic={{
                                content: {
                                    customHtml: (c, v, data) => {
                                        const percent = (data as any).percent as number;

                                        return (`
                                            <div>
                                                <p>${Math.round(percent * 100)}%</p>
                                                <p style="font-size: 20px; color: #383838;">${Math.round(percent * bottleData!.maxVolume)} mL</p>
                                            </div>
                                        `);
                                    }
                                }
                            }}
                        />
                    </Space>
                }
            </Card>
            <Card 
                style={{ width: 400, height: 150, boxSizing: 'border-box' }} 
                bodyStyle={{ width: '100%', height: '100%', padding: '10%' }}
                loading={loading}
            >
                <Flex style={{ width: '100%', height: '100%' }} justify="flex-start" align="center" gap="middle">
                    { bottleData && _getLastSipCard(bottleData!.lastDrankTime) }
                </Flex>
            </Card>
            <Card 
                style={{ width: 400, height: 150, boxSizing: 'border-box' }} 
                bodyStyle={{ width: '100%', height: '100%', padding: '10%' }}
                loading={loading}
            >
                <Flex style={{ width: '100%', height: '100%' }} justify="space-between" align="center" gap="middle">
                    <Statistic
                        title="Water Consumption"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                    <Divider type="vertical" style={{ height: '60px' }} />
                    <div style={{ textAlign: 'center' }}>
                        <Typography.Title level={3}>
                            + 268 mL
                        </Typography.Title>
                        <Typography>
                            compared to <br/> last week
                        </Typography>
                    </div>
                </Flex>
            </Card>
        </Flex>
    );
}

function _getLastSipCard(lastSipTime: number): JSX.Element {
    const lastSip = new Date(lastSipTime).getTime();
    const now = new Date().getTime();
    const timeDifference = (now - lastSip) / 1000 / 60; // Time since last sip in minutes

    // Get time string and badge color
    let timeString = "";
    let badgeColor = "red";

    // Less than a minute
    if (timeDifference < 1) {
        timeString = "<1 minute ago";
        badgeColor = "green"
    }
    // Less than an hour
    else if (timeDifference < 60) {
        const minuteDifference = Math.round(timeDifference);
        timeString = minuteDifference == 1 ? "1 minute ago" : `${minuteDifference} minutes ago`;
        badgeColor = "yellow"
    }
    // Less than a day
    else if (timeDifference < 60 * 24) {
        const hourDifference = Math.round(timeDifference / 60);
        timeString = hourDifference == 1 ? "1 minute ago" : `${hourDifference} hours ago`;
    }
    // Less than a week
    else if (timeDifference < 60 * 24 * 7) {
        const dayDifference = Math.round(timeDifference / 60 / 24);
        timeString = dayDifference == 1 ? "1 minute ago" : `${dayDifference} days ago`;
    }
    // More than that
    else {
        timeString = `on ${new Date(lastSipTime).toLocaleDateString('en-ZA')}`
    }

    return (<>
        <Badge dot={true} style={{ backgroundColor: badgeColor, width: '15px', height: '15px' }}>
            <Avatar
                size={70}
                shape="square"
                icon={<CalendarOutlined />}
            />
        </Badge>
        <Flex style={{ width: '100%', height: '100%', paddingLeft: '10px' }} gap="middle" vertical>
            <Typography>You last took a sip</Typography>
            <Typography.Title level={3} style={{ marginTop: 0 }}>{timeString}</Typography.Title>
        </Flex>
    </>);
}