import sequelize from "../config/db.config";
import { QueryTypes } from "sequelize";

export interface CentreQuery {
    name?: string;
    type_id?: number;
    class_type?: string;
    location: string;
    latitude?: number;
    longitude?: number;
    radius_km?: number;
    centre_id?: string;
    limit: number;
    offset: number;
}

export interface SearchOptionQuery {
    name: string;
    type_id: number;
    location: string;
}

export class CentreService {
    static async getCentres(query: CentreQuery) {
        const { name, type_id, class_type, location, latitude, longitude, radius_km, centre_id, limit, offset } = query;

        const conditions: string[] = [];
        const replacements: Record<string, any> = {};

        // Name filter
        if (name) {
            conditions.push(`wcen_name = :name`);
            replacements.name = name;
        }

        // Type filter
        if (type_id) {
            conditions.push(`wcen_type_id = :type_id`);
            replacements.type_id = type_id;
        }

        // Class type filter
        if (class_type) {
            conditions.push(`LOWER(wcen_classes_type) = LOWER(:class_type)`);
            replacements.class_type = class_type;
        }

        // Location filter
        if (location && location !== "All") {
            if (location === "Mumbai") {
                conditions.push(`LOWER(wcen_city) = 'mumbai'`);
            } else if (location === "India") {
                conditions.push(`LOWER(wcen_country) = 'india' AND LOWER(wcen_city) != 'mumbai'`);
            } else if (location === "Abroad") {
                conditions.push(`LOWER(wcen_country) != 'india'`);
            }
        }

        let distanceSelect = '';
        let orderBy = 'wcen_id ASC';

        // Nearby centre filter
        if (latitude && longitude && radius_km) {
            distanceSelect = `,
                (6371 * acos(
                    cos(radians(:latitude)) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:longitude)) +
                    sin(radians(:latitude)) *
                    sin(radians(latitude))
                )) AS distance`;

            conditions.push(`
                (6371 * acos(
                    cos(radians(:latitude)) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:longitude)) +
                    sin(radians(:latitude)) *
                    sin(radians(latitude))
                )) <= :radius_km
            `);

            if (centre_id) {
                conditions.push(`wcen_id != :centre_id`);
                replacements.centre_id = centre_id;
            }

            replacements.latitude = latitude;
            replacements.longitude = longitude;
            replacements.radius_km = radius_km;

            orderBy = 'distance ASC';
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const sqlQuery = `
            SELECT * ${distanceSelect}
            FROM web_centres_mst
            ${whereClause}
            ORDER BY ${orderBy}
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        `;

        return sequelize.query(sqlQuery, {
            replacements: { ...replacements, limit, offset },
            type: QueryTypes.SELECT,
        });
    }

    static async getSearchOptions(query: SearchOptionQuery) {
        const { name, type_id, location } = query;

        const replacements: Record<string, any> = {};
        const conditions: string[] = ["1=1"];

        if (name) {
            conditions.push("wcen_name LIKE :name");
            replacements.name = `%${name}%`; // partial match
        }

        if (type_id) {
            conditions.push("wcen_type_id = :type_id");
            replacements.type_id = type_id;
        }

        if (location && location !== "All") {
            if (location === "Mumbai") {
                conditions.push("LOWER(wcen_city) = 'mumbai'");
            } else if (location === "India") {
                conditions.push("LOWER(wcen_country) = 'india' AND LOWER(wcen_city) != 'mumbai'");
            } else if (location === "Abroad") {
                conditions.push("LOWER(wcen_country) != 'india'");
            }
        }

        const whereClause = `WHERE ${conditions.join(" AND ")}`;

        const sql = `
            SELECT wcen_id, wcen_name, wcen_city, wcen_state, wcen_country
            FROM web_centres_mst
            ${whereClause}
        `;

        const results = await sequelize.query(sql, {
            type: QueryTypes.SELECT,
            replacements,
        });

        return results;
    }

}
