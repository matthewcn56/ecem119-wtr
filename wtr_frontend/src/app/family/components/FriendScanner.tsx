import React from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

export default function FriendScanner(props: { otherUserRef: React.MutableRefObject<string>, nextStep: () => void }) {
    function _onDecode(result: string) {
        props.otherUserRef.current = result;
        props.nextStep();
    }

    return (
        <div style={{ height: '250px', width: '250px' }}>
            <QrScanner
                onDecode={_onDecode}
                onError={(error) => console.error(error?.message)}
            />
        </div>
    )
}