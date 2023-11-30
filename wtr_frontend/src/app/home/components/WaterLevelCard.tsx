import React from 'react';
import { Button, Card, Dropdown, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Liquid } from '@ant-design/plots';
import { DownOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';

import IBottleData from '@/types/IBottleData';

export default function WaterLevelCard(
    props: { 
        loading: boolean, 
        userBottles: MenuProps["items"], 
        bottleSelectorCallback: MenuProps["onClick"], 
        currentBottle: string | null,
        bottleData: IBottleData | null,
        setOpenModal: (arg0: string) => void,
    }
) {
    const { loading, userBottles, bottleSelectorCallback, currentBottle, bottleData, setOpenModal } = props;

    // Three dot dropdown
    const bottleActions: MenuProps["items"] = [
        {
            key: 'rename',
            label: 'Rename',
            icon: <EditOutlined />
        }
    ];

    function _handleThreeDotMenuClick(e: { key: string }) {
        switch (e.key) {
            case 'rename':
                setOpenModal('rename');
                break;
        }
    }

    return (
        <Card
            style={{ width: 350, height: 350, boxSizing: 'border-box' }}
            bodyStyle={{ width: '100%', height: `${350-56}px`, padding: '5%', boxSizing: 'border-box' }}
            loading={loading}
            title={
                <Dropdown 
                    menu={{ 
                        items: userBottles, 
                        onClick: bottleSelectorCallback,
                        selectable: true,
                        defaultSelectedKeys: [currentBottle || ''],
                    }} 
                    placement="bottomLeft"
                >
                    <Space>
                        <DownOutlined />
                        <Typography>{ bottleData?.name || "Unnamed wtr Bottle" }</Typography>
                    </Space>
                </Dropdown>
            }
            extra={<>
                <Dropdown menu={{ items: bottleActions, onClick: _handleThreeDotMenuClick }} placement="bottomRight">
                    <Button icon={<EllipsisOutlined />} />
                </Dropdown>
            </>}
        >
            <Space direction='vertical' style={{ display: 'flex', flex: 'space-around' }}>
                {
                    currentBottle && bottleData
                        ? (
                            // Actual data
                            <Liquid
                                percent={bottleData.currentWaterVolume}
                                height={250}
                                statistic={{
                                    content: {
                                        customHtml: (c, v, data) => {
                                            const percent = (data as any).percent as number;

                                            let htmlString = (`
                                                <div>
                                                    <p>${Math.round(percent * 100)}%</p>
                                            `);

                                            if (bottleData.maxVolume)
                                                htmlString += `<p style="font-size: 20px; color: #383838;">${Math.round(percent * bottleData.maxVolume)} mL</p>`;
                                            
                                            htmlString += `</div>`;
                                            return htmlString;
                                        }
                                    }
                                }}
                            />
                        ) : (
                            // No data, show grey liquid chart
                            <Liquid
                                percent={0.3}
                                height={250}
                                liquidStyle={{
                                    fill: 'grey',
                                    stroke: 'grey'
                                }}
                                statistic={{
                                    content: {
                                        formatter: () => "No Data"
                                    }
                                }}
                            />
                        )
                }
            </Space>
        </Card>
    );
}