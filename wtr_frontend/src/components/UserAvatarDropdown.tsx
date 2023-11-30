import { Avatar, Dropdown, Space } from "antd"
import type { MenuProps } from "antd";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";

import { useAuthContext } from "@/context/AuthContext"
import signOut from "@/firebase/auth/signOut";

export default function UserAvatarDropdown() {
    const { user } = useAuthContext();

    const userActions: MenuProps['items'] = [
        {
            key: 1,
            label: <a target="_blank" rel="noopener noreferer" onClick={signOut}>Sign out</a>,
            icon: <CloseOutlined />
        }
    ]

    return (
        <Dropdown menu={{ items: userActions }} placement="bottomRight">
            <a onClick={(e) => e.preventDefault()}>
                <Avatar 
                    shape="circle" 
                    size={64} 
                    /* Render user's avatar if available, otherwise use default icon */
                    icon={ (!user || !(user.photoURL)) && <UserOutlined /> }
                    src={ user && user!.photoURL && (<img src={user!.photoURL} alt="avatar" />)}
                />
            </a>
        </Dropdown>
    )
}