"use client"

import { Flex } from 'antd';

import { useAuthContext } from '@/context/AuthContext';
import ConsumptionStatisticCard from './components/ConsumptionStatisticCard';
import BottleInfoCards from './components/BottleInfoCards';

export default function Home() {
    const { user } = useAuthContext();

    return (
        <Flex style={{ width: '100%', height: '100%', padding: '25px' }} justify="center" align="center" gap="middle" vertical>
            <BottleInfoCards userWaterBottles={user?.waterBottles ?? []} />
            <ConsumptionStatisticCard userWaterBottles={user?.waterBottles ?? []} />
        </Flex>
    );
}