"use client"

import React from 'react';
import { Button, Divider, Flex, Input, Space, Typography } from "antd"
import { CloseCircleOutlined } from '@ant-design/icons';

export default function ScanStep(props: { codeRef: React.MutableRefObject<string>, nextStep: () => void }) {
    const [errorOccurred, setErrorOccurred] = React.useState<boolean>(false);

    return (
        <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
            <Flex vertical justify="center" align="center" gap={20}>
                <Typography.Text strong>
                    Enter your wtr code
                </Typography.Text>
                <Input 
                    showCount
                    maxLength={6}
                    onChange={(e) => props.codeRef.current = e.target.value}
                    onPressEnter={props.nextStep}
                />
                <div style={{ height: '30px' }} />
                <Button onClick={props.nextStep} type="primary">Continue</Button>
            </Flex>
        </Flex>
    )
}