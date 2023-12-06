"use client"

import React from 'react';
import { Card, Divider, Flex, Statistic, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getWaterBottleConsumption } from '@/firebase/db/bottles';
import getConsumptionData from '@/utils/getConsumptionData';

export default function ConsumptionStatisticCard(props: { userWaterBottles: string[] }) {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [waterConsumed, setWaterConsumed] = React.useState<[number, number]>([0, 0]);
    const [percentChange, setPercentChange] = React.useState<number>(0);

    // On load, get bottle data
    React.useEffect(() => {
        getConsumptionData(props.userWaterBottles).then((waterConsumed) => {
            // Finish calculations
            setWaterConsumed(waterConsumed);
            setLoading(false);
        });
    }, []);

    React.useEffect(() => {
        const [waterConsumedToday, waterConsumedYesterday] = waterConsumed;
        setPercentChange(((waterConsumedToday - waterConsumedYesterday) / waterConsumedYesterday) * 100);
    }, [waterConsumed]);

    return (
        <Card 
            title="Water Consumption"
            style={{ width: 350, height: 150, boxSizing: 'border-box' }} 
            bodyStyle={{ width: '100%', height: 'calc(100% - 56px)', padding: '5%' }}
            loading={loading}
        >
            <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center" gap="middle">
                {
                    props.userWaterBottles.length < 0 || Number.isNaN(percentChange)
                        ? (
                            <Typography.Title level={2} style={{ margin: 0 }}>
                                No Data
                            </Typography.Title>
                        ) : (<>
                            <Statistic
                                value={ Math.abs(percentChange) }
                                precision={2}
                                valueStyle={{ color: percentChange >= 0 ? '#3f8600' : '#ff2b4b' }}
                                prefix={ percentChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                suffix="%"
                            />
                            <Divider type="vertical" style={{ height: '60px' }} />
                            <div style={{ textAlign: 'center' }}>
                                <Typography.Title level={3} style={{ margin: 0 }}>
                                    {Math.round(waterConsumed[0])} mL
                                </Typography.Title>
                                <Typography>
                                    today
                                </Typography>
                            </div>
                        </>)
                }
            </Flex>
        </Card>
    );
}