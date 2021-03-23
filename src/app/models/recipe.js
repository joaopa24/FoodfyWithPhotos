const db = require('../../config/db')
const { date , feature } = require("../../lib/utils")

module.exports = {
    all(callback){
        db.query(`SELECT * FROM recipes`, function(err , results){
            if(err) throw `Database ${err}`
            
            callback(results.rows)
        })
    },
    create(data , callback){
        const query = `
           INSERT INTO recipes(
               chef_id,
               image,
               title,
               ingredients,
               preparation,
               information,
               created_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id
        `
        const values = [
               data.chef_id, 
               data.image,
               data.title,
               data.ingredients,
               data.preparation,
               data.textarea,
               date(Date.now()).iso,
        ]

        db.query(query , values ,function(err , results) {
            if(err) throw `Database ${err}`

            callback(results.rows[0])
        })
    },
    find(id , callback){
        db.query(`SELECT * FROM recipes WHERE id = $1`, [id], function(err , results){
            if(err) throw `Database ${err}`

            callback(results.rows[0])
        })
    },
    chefsOption(callback){
        db.query(`SELECT name, id FROM chefs`, function(err,results){
            if(err) throw `${err}`

            callback(results.rows)
        })   
    },
    update(data , callback){
        const query = `
        UPDATE recipes SET 
            chef_id=($1),
            image=($2),
            title=($3),
            ingredients=($4),
            preparation=($5),
            information=($6),
            created_at=($7)
            WHERE id = $8
     `
     const values = [
            data.chef, 
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.textarea,
            date(Date.now()).iso,
            data.id
     ] 

     db.query(query , values ,function(err , results) {
         if(err) throw `Database ${err}`

         callback(results.rows[0])
     })
    },
    paginate(params){
            const { filter , limit, offset, callback } = params
            
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
            
            db.query(query, [limit,offset], function(err,results){
                 if(err) throw `Database Error ${err}`
                
                 callback(results.rows)
            })
    }
}