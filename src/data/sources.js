// Bibliography lives in sources.json; labels + derived regions stay here.
import SOURCES from "./sources.json";

export { SOURCES };

export const SOURCE_TYPE_LABELS = {
    book: "Book",
    article: "Article",
    primary: "Primary source",
};

export const ALL_SOURCE_REGIONS = Array.from(
    new Set(SOURCES.flatMap((s) => s.region))
).sort();
