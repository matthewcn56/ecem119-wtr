import { Button, Divider, Flex, Input } from "antd"

export default function ScanStep(props: { codeRef: React.MutableRefObject<string>, nextStep: () => void }) {
    return (
        <Flex vertical justify="center" align="center" style={{ height: 'calc(100vh - 190px - 56px - 90px)' }}>
            <div style={{ height: '250px', width: '250px', backgroundColor: 'aliceblue' }}></div>
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