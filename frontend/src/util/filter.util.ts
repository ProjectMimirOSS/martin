export const filterService = (str: string, srcArr: any[]) => {
    return str ? srcArr.filter((src) => {
        return new RegExp(str, 'i').test(src.name) || new RegExp(str, 'i').test(src.pingUrl);
    }) : srcArr;
};
