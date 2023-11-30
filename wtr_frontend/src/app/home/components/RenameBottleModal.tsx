"use client"

import React from "react";
import { Input, Modal } from "antd";

import { updateBottleData } from "@/firebase/db/bottles";

export default function RenameBottleModal(
    props: { 
        open: boolean,
        currentBottle: string,
        originalName: string,
        onRename: (arg0: string) => void,
        closeModal: () => void
    }
) {
    const { open, currentBottle, originalName, closeModal, onRename } = props;

    const [newBottleName, setNewBottleName] = React.useState<string>("");

    function _handleBottleRename() {
        updateBottleData(currentBottle, { name: newBottleName });
        onRename(newBottleName);
        closeModal();
    }

    return (
        <Modal title="Rename" open={open} onOk={_handleBottleRename} onCancel={() => closeModal()}>
            <Input defaultValue={originalName} onChange={(e) => setNewBottleName(e.target.value)} />
        </Modal>
    )
}