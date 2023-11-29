import { Flex } from "antd";
import OnboardingFlowCard from "./components/OnboardingFlowCard";

export default function Onboard() {
    return (
        <Flex style={{ width: '100%', height: '100%', padding: '25px' }} justify="center" align="center" gap="middle" vertical>
            <OnboardingFlowCard />
        </Flex>
    );
}