import type { AgChartsExports } from '../../../../../agChartsExports';
import type { ChartTranslationKey } from '../../../../services/chartTranslationService';
import type { MiniChartSelector, ThemeTemplateParameters } from '../../miniChartsContainer';
import { stackData } from '../miniChartHelpers';
import { MiniLineClass, miniLineData } from './miniLine';

export const miniStackedLineData = stackData(miniLineData);
export class MiniStackedLineClass extends MiniLineClass {
    constructor(
        container: HTMLElement,
        agChartsExports: AgChartsExports,
        fills: string[],
        strokes: string[],
        _themeTemplateParameters: ThemeTemplateParameters,
        _isCustomTheme: boolean,
        data: number[][] = miniStackedLineData,
        tooltipName: ChartTranslationKey = 'stackedLineTooltip'
    ) {
        super(container, agChartsExports, fills, strokes, _themeTemplateParameters, _isCustomTheme, data, tooltipName);
    }
}

export const MiniStackedLine: MiniChartSelector = {
    chartType: 'stackedLine',
    miniChart: MiniStackedLineClass,
};
