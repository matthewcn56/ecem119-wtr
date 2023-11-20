import React from 'react';
import { Avatar, Badge, Card, Flex, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

export default function LastSipCard(props: { lastSipTime?: number, loading: boolean }): JSX.Element {
    const { lastSipTime, loading } = props;

    // Get time string and badge color
    let timeString = "";
    let badgeColor = "red";

    if (!lastSipTime) {
        timeString = "Data not available";
    } else {
        const lastSip = new Date(lastSipTime).getTime();
        const now = new Date().getTime();
        const timeDifference = (now - lastSip) / 1000 / 60; // Time since last sip in minutes

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
                <Flex style={{ width: '100%', height: '100%', paddingLeft: '10px' }} gap="middle" vertical>
                    <Typography>You last took a sip</Typography>
                    <Typography.Title level={3} style={{ marginTop: 0 }}>{timeString}</Typography.Title>
                </Flex>
            </Flex>
        </Card>
    );
}