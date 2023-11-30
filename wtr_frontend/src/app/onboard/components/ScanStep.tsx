"use client"

import React from 'react';
import { Button, Divider, Flex, Input, Space, Typography } from "antd"
import { CloseCircleOutlined } from '@ant-design/icons';

export default function ScanStep(props: { codeRef: React.MutableRefObject<string>, nextStep: () => void }) {
    const [errorOccurred, setErrorOccurred] = React.useState<boolean>(false);

    return (
        <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
            <div style={{ height: '250px', width: '250px' }}>
                {
                    errorOccurred
                        ? (
                            <Space size="middle" direction='vertical' style={{ display: 'flex', flex: 'space-around', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <CloseCircleOutlined style={{ fontSize: 100, color: 'red' }} />
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <Typography.Text strong>Looks like you don&apos;t have any wtr bottles.</Typography.Text>
                                    <br />
                                    <Typography.Text strong>Add one?</Typography.Text>
                                </div>
                            </Space>
                        ): (
                            <div style= {{ height: '250px', width: '250px', backgroundColor: 'aliceblue' }} />
                        )
                }
            </div>
            <Divider>or</Divider>
            <Flex vertical justify="center" align="center" gap={10}>
                <Input 
                    showCount
                    maxLength={6}
                    placeholder="Enter your wtr code"
                    onChange={(e) => props.codeRef.current = e.target.value}
                    onPressEnter={props.nextStep}
                />
                <Button onClick={props.nextStep} type="primary">Continue</Button>
            </Flex>
        </Flex>
    )
}