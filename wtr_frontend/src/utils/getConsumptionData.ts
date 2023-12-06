import { getWaterBottleConsumption } from "@/firebase/db/bottles";

export default async function getConsumptionData(waterBottles: string[]): Promise<[number, number]> {
    // Gets date in format YYYYMMDD
    const todayDate = new Date()
        .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3$1$2');

    // Get's each water bottle's consumption data and
    // if non-null, will add them all together in format
    // [total water consumed today, total water consumed yesterday]
    const waterConsumed = (await Promise.all(
        waterBottles.map(async (wb) => {
            return getWaterBottleConsumption(wb)
                .then((consumption): [number, number] => {
                    if (!consumption)
                        return [0, 0];
                    else if (consumption.todaysDate != todayDate)
                        return [0, 0];
                    else
                        return [consumption.waterConsumedToday, consumption.waterConsumedYesterday];
                }).catch((e): [number, number] => [0, 0]);
        })
    )).reduce(
        (accum: [number, number], v: [number, number]) => [accum[0] + v[0], accum[1] + v[1]],
        [0, 0]
    );

    return new Promise((resolve, reject) => resolve(waterConsumed));
}