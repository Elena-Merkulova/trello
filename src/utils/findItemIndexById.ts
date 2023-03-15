//Define a function that will accept any object 
//that has a field id: string

interface Item {
    id: string
}

//Use generic type T that extends Item
export const findItemIndexById = <T extends Item>(items: T[], id: string) => {
    return items.findIndex((item: T) => item.id === id)
}