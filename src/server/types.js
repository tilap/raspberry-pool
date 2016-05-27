export type RaspberryConfig = {
    time?: number,
    display?: string,
    url?: string,
};

export type RaspberryData = {
    id: string,
    name: string,
    macAddresses: Array<string>,
    config: RaspberryConfig,
};

export type Raspberry = {
    id: string,
    data: RaspberryData,
    registered: boolean,
    online: boolean|string,
    ip: string|null,
};
