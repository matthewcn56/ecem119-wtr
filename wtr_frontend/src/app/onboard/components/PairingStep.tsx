import { Flex, Typography } from 'antd';

export default function PairingStep(props: { wtrCode: string }) {
    return (
        <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
            <Typography.Text style={{ fontSize: '18px' }}>Pairing your wtr bottle</Typography.Text>
            <Typography.Text style={{ fontSize: '48px' }} strong>{props.wtrCode}</Typography.Text>
        </Flex>
    );
}