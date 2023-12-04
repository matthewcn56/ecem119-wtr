"use client"

import React from 'react';
import { Card, Divider, Flex, Statistic, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getWaterBottleConsumption } from '@/firebase/db/bottles';

export default function ConsumptionStatisticCard(props: { userWaterBottles: string[] }) {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [waterConsumed, setWaterConsumed] = React.useState<[number, number]>([0, 0]);
    const [percentChange, setPercentChange] = React.useState<number>(0);

    // On load, get bottle data
    React.useEffect(() => {
        // Gets date in format YYYYMMDD
        const todayDate = new Date()
            .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/(\d+)\/(\d+)\/(\d+)/, '$3$1$2');

        async function _getConsumptionData() {
            // Get's each water bottle's consumption data and
            // if non-null, will add them all together in format
            // [total water consumed today, total water consumed yesterday]
            const waterConsumed = (await Promise.all(
                props.userWaterBottles.map(async (wb) => {
                    return getWaterBottleConsumption(wb).then((consumption): [number, number] => {
                        if (!consumption)
                            return [0, 0];
                        else if (consumption.todaysDate != todayDate)
                            return [0, 0];
                        else
                            return [consumption.waterConsumedToday, consumption.waterConsumedYesterday];
                    });
                })
            )).reduce(
                (accum: [number, number], v: [number, number]) => [accum[0] + v[0], accum[1] + v[1]],
                [0, 0]
            );

            // Finish calculations
            setWaterConsumed(waterConsumed);
            setLoading(false);
        }

        _getConsumptionData();
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
                                    {waterConsumed[0]} mL
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