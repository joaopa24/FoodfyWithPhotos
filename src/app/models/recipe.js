const db = require('../../config/db')
const { date , feature } = require("../../lib/utils")

module.exports = {
    all(){
        return db.query(`SELECT * FROM recipes`)
    },
    create(data){
        const query = `
           INSERT INTO recipes(
               chef_id,
               title,
               ingredients,
               preparation,
               information,
               created_at
           ) VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id
        `
        const values = [
               data.chef_id, 
               data.title,
               data.ingredients,
               data.preparation,
               data.textarea,
               date(Date.now()).iso,
        ]

        return db.query(query , values)
    },
    find(id){
        return db.query(`SELECT * FROM recipes WHERE id = $1`, [id])
    },
    chefsOption(){
        return db.query(`SELECT name, id FROM chefs`)
    },
    update(data){
        const query = `
        UPDATE recipes SET 
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5),
            created_at=($6)
            WHERE id = $7
     `
     const values = [
            data.chef, 
            data.title,
            data.ingredients,
            data.preparation,
            data.textarea,
            date(Date.now()).iso,
            data.id
     ] 

     return db.query(query , values)
    },
    async paginate(params){
            const { filter , limit, offset } = params
            
            let query = "",
                filterQuery = "",
                totalQuery = `(
                    SELECT count(*) FROM recipes
                ) AS total`

            if(filter){
                filterQuery = `${query}
                WHERE recipes.title ILIKE '%${filter}%'
                
                `
                totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                ) as total`
            }
            
            query = `
            SELECT recipes.*,${totalQuery}
            FROM recipes
            ${filterQuery}
            LIMIT $1 OFFSET $2 
            `
            
            const results = await db.query(query, [limit,offset])

            return results.rows
    }
}