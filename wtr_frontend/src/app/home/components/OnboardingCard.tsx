"use client"

import { useRouter } from "next/navigation";
import { Button, Card, Space, Typography } from "antd";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";

export default function OnboardingCard() {
    const router = useRouter();

    return (
        <Card
            style={{ width: 350, height: 350, boxSizing: 'border-box' }}
            bodyStyle={{ width: '100%', height: `350px`, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5%', boxSizing: 'border-box' }}
        >
            <Space size="middle" direction='vertical' style={{ display: 'flex', flex: 'space-around', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <CloseCircleOutlined style={{ fontSize: 100, color: 'red' }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Typography.Text strong>Looks like you don&apos;t have any wtr bottles.</Typography.Text>
                    <br />
                    <Typography.Text strong>Add one?</Typography.Text>
                </div>
                <Button 
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/onboard')}
                >
                    Add a new wtr bottle
                </Button>
            </Space>
        </Card>
    )
}