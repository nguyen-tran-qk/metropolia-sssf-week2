'use strict';

const rectangleBounds = (topRight, bottomLeft) => (
    {
        type: 'Polygon',
        coordinates: [
            [
                [bottomLeft.lng, bottomLeft.lat],
                [bottomLeft.lng, topRight.lat],
                [topRight.lng, topRight.lat],
                [topRight.lng, bottomLeft.lat],
                [bottomLeft.lng, bottomLeft.lat],
            ],
        ],
    }
);

module.exports = rectangleBounds;
