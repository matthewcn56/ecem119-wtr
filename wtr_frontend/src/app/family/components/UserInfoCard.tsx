import { Avatar, Button, Card, Divider, Flex, Typography } from "antd";
import { QrcodeOutlined, ScanOutlined, UserOutlined } from "@ant-design/icons";

import IUser from "@/types/IUser";

export default function UserInfoCard(props: { loading: boolean, user: IUser, onShowCode: () => void, onAddFriend: () => void }) {
    const { loading, user } = props;

    return (            
        <Card 
            style={{ width: 350, height: 200, boxSizing: 'border-box' }} 
            bodyStyle={{ width: '100%', height: '100%', padding: '5% 10%' }}
            loading={loading}
        >
            {
                !loading &&
                <>
                    <Flex style={{ width: '100%', height: 'calc(100% - 48px - 50px)' }} justify="center" align="center" gap="middle">
                        <Avatar
                            size={70}
                            shape="square"
                            /* Render user's avatar if available, otherwise use default icon */
                            icon={ !user.photoURL && <UserOutlined /> }
                            src={ user.photoURL && (<img src={user!.photoURL} alt="avatar" />)}
                        />
                        <Flex style={{ width: '100%', height: '100%', paddingLeft: '10px' }} gap="small" justify="center" vertical>
                            <Typography.Title level={3} style={{ margin: 0 }}>
                                {user.displayName}
                            </Typography.Title>
                            <Typography.Text>
                                {user.familyMembers?.length || 0} family member{user.familyMembers?.length == 1 ? "" : "s"}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                    <Divider />
                    <Flex style={{ width: '100%', height: '50px' }} justify="center" align="center" gap="middle">
                        <Button icon={<QrcodeOutlined />} onClick={props.onShowCode}>
                            Show my code
                        </Button>
                        <Button icon={<ScanOutlined />} onClick={props.onAddFriend}>
                            Add a friend
                        </Button>
                    </Flex>
                </>
            }
        </Card>
    );
}