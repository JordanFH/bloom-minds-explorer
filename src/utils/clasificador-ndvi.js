export function clasificarNDVI(item) {
    if (item.ndvi < 0) {
        return "Water, snow or clouds";
    } else if (item.ndvi < 0.2) {
        return "Very little or no vegetation. Bare soil, rocks, sand, urban areas.";
    } else if (item.ndvi < 0.6) {
        return "Moderate vegetation. Grasslands, shrubs, or plants at the beginning or end of their growing season.";
    } else {
        return "Very dense and healthy vegetation. Think of a forest in midsummer or a thriving crop.";
    }
}

export function clasificarNDVIColor(item) {
    if (item.ndvi < 0) {
        return "bg-blue-50 border-blue-300 text-blue-700";
    } else if (item.ndvi < 0.2) {
        return "bg-orange-50 border-orange-300 text-orange-700";
    } else if (item.ndvi < 0.6) {
        return "bg-lime-50 border-lime-300 text-lime-700";
    } else {
        return "bg-emerald-50 border-emerald-300 text-emerald-700";
    }
}

export function transformDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getFirstDayOfMonth(date) {
    const newDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return newDate;
}

export function getLastDayOfMonth(date) {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return newDate;
}

// Si quieres que retornen directamente en formato string:
export function getFirstDayOfMonthFormatted(date) {
    const firstDay = getFirstDayOfMonth(date);
    return transformDate(firstDay);
}

export function getLastDayOfMonthFormatted(date) {
    const lastDay = getLastDayOfMonth(date);
    return transformDate(lastDay);
}