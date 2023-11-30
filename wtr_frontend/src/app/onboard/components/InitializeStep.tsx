import { Button, Flex, Typography } from "antd";

export default function InitializeStep(props: { nextStep: () => void }) {
    return (
        <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
            <Typography.Text strong>Press the pair button on your wtr bottle.</Typography.Text>
            <img
                src="push-button.gif"
                width={200}
                height={200}
                alt="push-button"
            />
            <div style={{ height: '50px' }} />
            <Typography.Text strong>Press Continue when you see three flashes.</Typography.Text>
            <Button style={{ marginTop: '20px' }} onClick={props.nextStep} type="primary">Continue</Button>
        </Flex>
    );
}