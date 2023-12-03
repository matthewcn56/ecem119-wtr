"use client"

import React from 'react';
import { Flex } from 'antd';

import { useAuthContext } from '@/context/AuthContext';
import ConsumptionStatisticCard from './components/ConsumptionStatisticCard';
import BottleInfoCards from './components/BottleInfoCards';

export default function Home() {
    const { user } = useAuthContext();

    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 5000);
    }, []);

    return (
        <Flex style={{ width: '100%', height: '100%', padding: '25px' }} justify="center" align="center" gap="middle" vertical>
            <BottleInfoCards userWaterBottles={user?.waterBottles ?? []} />
            <ConsumptionStatisticCard userWaterBottles={user?.waterBottles ?? []} />
        </Flex>
    );
}