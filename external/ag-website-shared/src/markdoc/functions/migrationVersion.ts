import type { VersionData } from '@ag-grid-types';
import { getHighestPatch } from '@ag-website-shared/utils/getHighestPatch';
import { parseVersion } from '@ag-website-shared/utils/parseVersion';
import type { ConfigFunction } from '@markdoc/markdoc';

/**
 * Return the major/minor version of the migration version
 */
export const migrationVersion: ConfigFunction = {
    transform(_, context) {
        const migrationVersion = context.variables?.migrationVersion;
        if (!migrationVersion) {
            return;
        }
        const { major, minor } = parseVersion(migrationVersion);
        return `${major}.${minor}`;
    },
};

/**
 * Return the major/minor and latest patch version available for the migration version
 */
export const getMigrationVersionPatch: (versionsData: VersionData[]) => ConfigFunction = (versionsData) => {
    return {
        transform(_, context) {
            const migrationVersion = context.variables?.migrationVersion;
            if (!migrationVersion) {
                return;
            }
            const { major, minor } = parseVersion(migrationVersion);
            const highestPatch = getHighestPatch({ versionsData, major, minor });
            return `${major}.${minor}.${highestPatch}`;
        },
    };
};
