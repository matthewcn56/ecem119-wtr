export default interface IBottleData {
    name: string,
    ownerID: string,
    currentWaterVolume: number,
    maxVolume: number,
    lastDrankTime: number,
    todaysDate?: string,
    waterConsumedToday?: number,
    waterConsumedYesterday?: number,
}

export type IConsumptionData = Required<Pick<IBottleData, "todaysDate" | "waterConsumedToday" | "waterConsumedYesterday">>;