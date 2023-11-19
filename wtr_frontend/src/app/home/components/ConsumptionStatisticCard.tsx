import { Card, Divider, Flex, Statistic, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

export default function ConsumptionStatisticCard(props: { loading: boolean }) {
    const { loading } = props;

    return (
        <Card 
            style={{ width: 400, height: 150, boxSizing: 'border-box' }} 
            bodyStyle={{ width: '100%', height: '100%', padding: '10%' }}
            loading={loading}
        >
            <Flex style={{ width: '100%', height: '100%' }} justify="space-between" align="center" gap="middle">
                <Statistic
                    title="Water Consumption"
                    value={11.28}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                />
                <Divider type="vertical" style={{ height: '60px' }} />
                <div style={{ textAlign: 'center' }}>
                    <Typography.Title level={3}>
                        + 268 mL
                    </Typography.Title>
                    <Typography>
                        compared to <br/> last week
                    </Typography>
                </div>
            </Flex>
        </Card>
    );
}