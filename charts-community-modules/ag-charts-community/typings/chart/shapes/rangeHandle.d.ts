import { Path } from '../../scene/shape/path';
import { BBox } from '../../scene/bbox';
import type { ShapeLineCap } from '../../scene/shape/shape';
export declare class RangeHandle extends Path {
    static className: string;
    protected _fill: string;
    protected _stroke: string;
    protected _strokeWidth: number;
    protected _lineCap: ShapeLineCap;
    protected _centerX: number;
    set centerX(value: number);
    get centerX(): number;
    protected _centerY: number;
    set centerY(value: number);
    get centerY(): number;
    protected _width: number;
    set width(value: number);
    get width(): number;
    protected _gripLineGap: number;
    set gripLineGap(value: number);
    get gripLineGap(): number;
    protected _gripLineLength: number;
    set gripLineLength(value: number);
    get gripLineLength(): number;
    protected _height: number;
    set height(value: number);
    get height(): number;
    computeBBox(): BBox;
    isPointInPath(x: number, y: number): boolean;
    updatePath(): void;
}
//# sourceMappingURL=rangeHandle.d.ts.map