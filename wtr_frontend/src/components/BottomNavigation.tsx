import { Button } from 'antd';

import styles from '@/styles/BottomNavigation.module.css';

export function BottomNavigationItem(props: { label: string, icon: React.ReactNode, onClick?: React.MouseEventHandler<HTMLElement> }) {
    return (
        <Button icon={props.icon} type="text" onClick={props.onClick}>
            { props.label }
        </Button>
    );
}

export default function BottomNavigation({ children }: { children: React.ReactElement<typeof BottomNavigationItem>[] }) {
    return (
        <div className={styles.bottomNavigation}>
            { children }
        </div>
    );
}