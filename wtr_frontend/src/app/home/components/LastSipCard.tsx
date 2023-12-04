import React from 'react';
import { Avatar, Badge, Card, Flex, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import lastSipTimeHumanReadable from '@/utils/lastSipTimeHumanReadable';

export default function LastSipCard(props: { lastSipTime?: number, loading: boolean }): JSX.Element {
    const { lastSipTime, loading } = props;

    // Get time string and badge color
    let timeString = "";
    let badgeColor = "red";

    if (!lastSipTime) {
        timeString = "Data not available";
    } else {
        [timeString, badgeColor] = lastSipTimeHumanReadable(lastSipTime);
    }

    return (            
        <Card 
            style={{ width: 350, height: 150, boxSizing: 'border-box' }} 
            bodyStyle={{ width: '100%', height: '100%', padding: '5%' }}
            loading={loading}
        >
            <Flex style={{ width: '100%', height: '100%' }} justify="flex-start" align="center" gap="middle">
                <Badge dot={true} style={{ backgroundColor: badgeColor, width: '15px', height: '15px' }}>
                    <Avatar
                        size={70}
                        shape="square"
                        icon={<CalendarOutlined />}
                    />
                </Badge>
                <Flex style={{ width: '100%', height: '100%', paddingLeft: '10px' }} gap="small" justify="center" vertical>
                    <Typography>You last took a sip</Typography>
                    <Typography.Title level={3} style={{ marginTop: 0 }}>{timeString}</Typography.Title>
                </Flex>
            </Flex>
        </Card>
    );
}