const data = {
    "name": "Received",
    "timestampsList": [
        {"seconds": 1675209600, "nanos": 0},
        {"seconds": 1677628800, "nanos": 0},
        {"seconds": 1680307200, "nanos": 0},
        {"seconds": 1682899200, "nanos": 0},
        {"seconds": 1685577600, "nanos": 0},
        {"seconds": 1688169600, "nanos": 0},
        {"seconds": 1690848000, "nanos": 0},
        {"seconds": 1693526400, "nanos": 0},
        {"seconds": 1696118400, "nanos": 0},
        {"seconds": 1698796800, "nanos": 0},
        {"seconds": 1701388800, "nanos": 0},
        {"seconds": 1704067200, "nanos": 0},
        {"seconds": 1706745600, "nanos": 0}
    ],
    "datasetsList": [
        {
            "label": "rx_count",
            "dataList": [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7
            ]
        }
    ],
    "kind": 1
};

const timestamps = data.timestampsList;

timestamps.forEach(timestamp => {
    const seconds = timestamp.seconds;
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds
    console.log(date);
});