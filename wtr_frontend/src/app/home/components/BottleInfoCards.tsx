"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { MenuItemType } from "antd/es/menu/hooks/useItems";

import LastSipCard from './LastSipCard';
import { attachBottleHandler, getWaterBottleName, removeBottleHandler } from "@/firebase/db/bottles";

import RenameBottleModal from './RenameBottleModal';
import WaterLevelCard from "./WaterLevelCard";
import IBottleData from "@/types/IBottleData";
import OnboardingCard from "./OnboardingCard";

export default function BottleInfoCards(
    props: { 
        userWaterBottles?: string[],
    }
) {
    const { userWaterBottles } = props;
    const router = useRouter();

    const [loading, setLoading] = React.useState<boolean>(true);
    const [userBottles, setUserBottles] = React.useState<MenuItemType[]>([]);
    const [currentBottle, setCurrentBottle] = React.useState<string | null>(null);
    const [bottleData, setBottleData] = React.useState<IBottleData | null>(null);

    // Modals
    type AvailableModals = 'rename';
    const [openModal, setOpenModal] = React.useState<AvailableModals | null>(null);

    // Get all water bottles associated to current user
    React.useEffect(() => {
        async function _getWaterBottleNames() {
            const availableWaterBottles: MenuItemType[] = 
                // Get names
                (await Promise.all(
                    userWaterBottles!.map(async (wb) => {
                        return getWaterBottleName(wb).then((wbName) => {
                            return {
                                key: wb,
                                label: wbName
                            };
                        }).catch((e) => {
                            return {
                                key: 'XXX_REMOVE',
                                label: 'XXX_REMOVE'
                            };
                        });
                    })
                ))
                // Filter out unavailable names
                .filter(
                    (wbObj) => wbObj.key !== 'XXX_REMOVE'
                );

            // Add the "Add new water bottle" button
            availableWaterBottles.push({
                key: 'new_water_bottle',
                label: <Button icon={<PlusOutlined />} onClick={() => router.push('/onboard')}>Add a new wtr bottle</Button>,
            })

            // Set state
            setUserBottles(availableWaterBottles);
        }

        setLoading(true);

        if (userWaterBottles)
            _getWaterBottleNames();
        else
            setUserBottles([]);
        
        setLoading(false);
    }, [userWaterBottles]);

    // When all water bottles loaded, set the current bottle to be the first one in the list
    React.useEffect(() => {
        if (userBottles && userBottles[0] && userBottles[0].key)
            if (currentBottle)
                return;
            else
                setCurrentBottle(userBottles[0].key as string);
        else
            setCurrentBottle(null);
    }, [userBottles]);

    // Load data for current water bottle
    React.useEffect(() => {
        setLoading(true);

        if (!currentBottle) {
            setLoading(false);
            return;
        }  

        attachBottleHandler(
            currentBottle,
            (newBottleData) => {
                setLoading(false);
                setBottleData(newBottleData);
            }
        );
    }, [currentBottle]);

    // Bottle selector dropdown
    function _handleBottleSelector(e: { key: string }) {
        setCurrentBottle((oldBottleID) => {
            if (oldBottleID)
                removeBottleHandler(oldBottleID);

            return e.key;
        });
    }

    // Open correct modal
    function _openModal(modalName: string) {
        switch (modalName) {
            case 'rename':
                setOpenModal('rename');
                break;
        }
    }

    function _onBottleRename(newName: string) {
        let wbToUpdate = userBottles.findIndex((wb) => wb.key == currentBottle);
        if (wbToUpdate !== undefined) {
            let newUserBottles = [...userBottles];
            newUserBottles[wbToUpdate]!.label = newName;
            setUserBottles(newUserBottles);
        }
    }

    // If user has no associated water bottles, show onboarding
    if (!userWaterBottles || userWaterBottles.length == 0) {
        return <OnboardingCard />;
    }
    
    return (<>
        <RenameBottleModal 
            open={openModal == 'rename'} 
            currentBottle={currentBottle!} 
            originalName={bottleData?.name || ""}
            closeModal={() => setOpenModal(null)} 
            onRename={_onBottleRename} 
        />
        <WaterLevelCard
            loading={loading}
            userBottles={userBottles}
            bottleSelectorCallback={_handleBottleSelector}
            currentBottle={currentBottle}
            bottleData={bottleData}
            setOpenModal={_openModal}
        />
        <LastSipCard loading={loading} lastSipTime={bottleData?.lastDrankTime} />
    </>);
}