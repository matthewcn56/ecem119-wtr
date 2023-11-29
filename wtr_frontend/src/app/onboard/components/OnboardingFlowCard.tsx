"use client"

import React from 'react';
import { Card, Flex, Steps } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import InitializeStep from './InitializeStep';
import ScanStep from './ScanStep';
import PairingStep from './PairingStep';

export default function OnboardingCard() {
    const [currentStep, setCurrentStep] = React.useState<number>(0);
    const wtrCode = React.useRef<string>("");

    const steps = [
        {
            title: 'Init',
            content: <InitializeStep nextStep={() => setCurrentStep(1)} />,
        },
        {
            title: 'Scan',
            content: <ScanStep codeRef={wtrCode} nextStep={() => setCurrentStep(2)} />,
        },
        {
            title: 'Pair',
            content: <PairingStep wtrCode={wtrCode.current} />,
            icon: currentStep == 2 ? <LoadingOutlined /> : undefined,
        }
    ];

    return (
        <Card
            style={{ width: 350, height: 'calc(100vh - 190px)', boxSizing: 'border-box' }}
            bodyStyle={{ width: '100%', height: `calc(100vh - 190px - 56px)`, padding: '5%', boxSizing: 'border-box' }}
            title="Add a new wtr bottle"
        >
            <Flex vertical justify='flex-start' align='center'>
                <Steps 
                    style={{ height: '80px' }} 
                    current={currentStep} 
                    items={steps.map((s) => ({ key: s.title, title: s.title, icon: s.icon }))} 
                    labelPlacement='vertical' 
                    responsive={false}
                />
                <div style={{ height: '10px' }} />
                {steps[currentStep].content}
            </Flex>
        </Card>
    );
}