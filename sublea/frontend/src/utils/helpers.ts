import {format, parseISO } from "date-fns";


/**
 * Helper function for images coming as URLs from backend
 * Assuming storage as: "url1,url2,url3,urln"
 */

export const parseImages = (csvImages?: string | null): string[] => {
    return csvImages ? csvImages.split(",").map(img => img.trim()).filter(Boolean) : [];
};


/**
 * Format dateTime strings using import date-fns
 */

export const formatDate = (isoString: string, formatStr: string = 'MMM dd, yyyy'): string => {
    try {
        return format(parseISO(isoString), formatStr);

    } catch (error) {
        console.error("Invalid date string: ", isoString);
        return isoString
    }
};

export const formatDateTime = (isoString: string): string => {
    return formatDate(isoString, 'MMM dd, yyyy h:mm a');
}
