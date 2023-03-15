//Create the moveItem function, which takes the source array, and two indices 
//that it will swap.

export const moveItem = <T>(array: T[], from: number, to: number) => {
    const startIndex = to < 0 ? array.length + to : to;
    const item = array.splice(from, 1)[0]
    array.splice(startIndex, 0, item)
    return array
}