// https://www.blobmaker.app/

import {rand} from "./internal/rand";
import {Shape} from "./internal/types";
import {smooth, rad} from "./internal/util";
import {renderEditable} from "./internal/render/svg";
import {XmlElement} from "./editable";

export interface PathOptions {
    // Bounding box dimensions.
    size: number;

    // Shape complexity.
    complexity: number;

    // Shape contrast.
    contrast: number;

    // Value to seed random number generator.
    seed?: string;
}

export interface BlobOptions extends PathOptions {
    // Fill color.
    color?: string;

    stroke?: {
        // Stroke color.
        color: string;

        // Stroke width.
        width: number;
    };

    // Render points, handles and stroke.
    guides?: boolean;
}

// Generates an svg document string containing a randomized rounded shape.
const blobs = (opt: BlobOptions): string => {
    return blobs.editable(opt).render();
};

// Generates an editable data structure which can be rendered to an svg document
// containing a randomized rounded shape.
blobs.editable = (opt: BlobOptions): XmlElement => {
    if (!opt) {
        throw new Error("no options specified");
    }

    // Random number generator.
    const rgen = rand(opt.seed || String(Date.now()));

    if (!opt.size) {
        throw new Error("no size specified");
    }

    if (!opt.stroke && !opt.color) {
        throw new Error("no color or stroke specified");
    }

    if (opt.complexity <= 0 || opt.complexity > 1) {
        throw new Error("complexity out of range ]0,1]");
    }

    if (opt.contrast < 0 || opt.contrast > 1) {
        throw new Error("contrast out of range [0,1]");
    }

    const count = 3 + Math.floor(14 * opt.complexity);
    const angle = 360 / count;
    const radius = opt.size / Math.E;

    const points: Shape = [];
    for (let i = 0; i < count; i++) {
        const rand = 1 - 0.8 * opt.contrast * rgen();
        points.push({
            x: Math.sin(rad(i * angle)) * radius * rand + opt.size / 2,
            y: opt.size - (Math.cos(rad(i * angle)) * radius * rand + opt.size / 2),
            handleIn: {angle: 0, length: 0},
            handleOut: {angle: 0, length: 0},
        });
    }

    // https://math.stackexchange.com/a/873589/235756
    const smoothingStrength = ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2));
    const smoothed = smooth(points, smoothingStrength);

    return renderEditable(smoothed, {
        closed: true,
        width: opt.size,
        height: opt.size,
        fill: opt.color,
        transform: `rotate(${rgen() * angle},${opt.size / 2},${opt.size / 2})`,
        stroke: opt.stroke && opt.stroke.color,
        strokeWidth: opt.stroke && opt.stroke.width,
        guides: opt.guides,
    });
};

// TODO remove
blobs.path = (opt: PathOptions) => {
    if (!opt) {
        throw new Error("no options specified");
    }

    // Random number generator.
    const rgen = rand(opt.seed || String(Date.now()));

    if (!opt.size) {
        throw new Error("no size specified");
    }

    if (opt.complexity <= 0 || opt.complexity > 1) {
        throw new Error("complexity out of range ]0,1]");
    }

    if (opt.contrast < 0 || opt.contrast > 1) {
        throw new Error("contrast out of range [0,1]");
    }

    const count = 3 + Math.floor(14 * opt.complexity);
    const angle = 360 / count;
    const radius = opt.size / Math.E;

    const points: Shape = [];
    for (let i = 0; i < count; i++) {
        const rand = 1 - 0.8 * opt.contrast * rgen();
        points.push({
            x: Math.sin(rad(i * angle)) * radius * rand + opt.size / 2,
            y: Math.cos(rad(i * angle)) * radius * rand + opt.size / 2,
            handleIn: {angle: 0, length: 0},
            handleOut: {angle: 0, length: 0},
        });
    }

    // https://math.stackexchange.com/a/873589/235756
    const smoothingStrength = ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2));
    const smoothed = smooth(points, smoothingStrength);

    return smoothed;
};

export default blobs;
