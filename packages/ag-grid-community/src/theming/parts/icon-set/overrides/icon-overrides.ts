import { createPart } from '../../../Part';
import { colorValueToCss, fontFamilyValueToCss, fontWeightValueToCss, imageValueToCss } from '../../../theme-types';
import type { ColorValue, FontFamilyValue, FontWeightValue, ImageValue } from '../../../theme-types';

type IconSetOverridesImage = {
    type: 'image';
    mask?: boolean;
    cssImports?: string[];
    icons: {
        [key: string]: ImageValue;
    };
};

type IconSetOverridesFont = {
    type: 'font';
    weight?: FontWeightValue;
    family?: FontFamilyValue;
    color?: ColorValue;
    cssImports?: string[];
    icons: {
        [key: string]: string;
    };
};

type IconSetOverridesArgs = IconSetOverridesImage | IconSetOverridesFont;

export const iconOverrides = (args: IconSetOverridesArgs) => {
    const cssParts: string[] = [];
    if (args.type === 'image') {
        const { icons, mask } = args;
        for (const key of Object.keys(icons)) {
            const imageCssValue = imageValueToCss(icons[key]);
            if (mask) {
                cssParts.push(`.ag-icon-${key}::before { mask-image: ${imageCssValue}; }`);
            } else {
                cssParts.push(`.ag-icon-${key}::before { background-image: ${imageCssValue}; ${unsetMaskIcon} }`);
            }
        }
    }
    if (args.type === 'font') {
        const { family, weight, color, icons } = args;
        let properties = unsetMaskIcon;
        if (family) {
            properties += ` font-family: ${fontFamilyValueToCss(family)};`;
        }
        if (weight) {
            properties += ` font-weight: ${fontWeightValueToCss(weight)};`;
        }
        if (color) {
            properties += ` color: ${colorValueToCss(color)};`;
        }
        for (const key of Object.keys(icons)) {
            cssParts.push(`.ag-icon-${key}::before { content: ${JSON.stringify(icons[key])}; ${properties} }`);
        }
    }
    return createPart({
        css: cssParts.join(';\n'),
        cssImports: args.cssImports,
    });
};

const unsetMaskIcon = `background-color: unset; mask-image: unset; -webkit-mask-image: unset;`;
