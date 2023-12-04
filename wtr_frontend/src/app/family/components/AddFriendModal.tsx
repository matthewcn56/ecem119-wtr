"use client"

import React from "react";
import { Flex, Steps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import FriendAdder from "./FriendAdder";
import FriendScanner from "./FriendScanner";
import IUser from "@/types/IUser";

export default function AddFriendModal(props: { user: IUser, closeModal: () => void }) {
    const [currentStep, setCurrentStep] = React.useState<number>(0);
    const [addSuccess, setAddSuccess] = React.useState<boolean>(false);
    const [errorOccurred, setErrorOccurred] = React.useState<boolean>(false);

    const otherUser = React.useRef<string>("");

    const steps = [
        {
            title: 'Scan',
            content: <FriendScanner otherUserRef={otherUser} nextStep={() => setCurrentStep(1)} />,
        },
        {
            title: 'Add',
            content: (
                <FriendAdder 
                    user1={props.user.uid} 
                    user2={otherUser.current} 
                    closeModal={props.closeModal}
                    reset={_reset} 
                    onError={() => setErrorOccurred(true)} 
                    onSuccess={() => setAddSuccess(true)}
                />
            ),
            icon: (currentStep == 1 && !errorOccurred && !addSuccess) ? <LoadingOutlined /> : undefined,
        },
    ];

    function _reset() {
        setCurrentStep(0);
        setErrorOccurred(false);
        setAddSuccess(false);
    }

    return (
        <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center" gap="middle" vertical>
            <Steps 
                style={{ height: '80px', width: 'max(70%, 200px)' }} 
                status={errorOccurred ? 'error' : undefined}
                current={currentStep} 
                items={steps.map((s) => ({ key: s.title, title: s.title, icon: s.icon }))} 
                labelPlacement='vertical' 
                responsive={false}
            />
            <div style={{ height: '10px' }} />
            {steps[currentStep].content}
        </Flex>
    )
}