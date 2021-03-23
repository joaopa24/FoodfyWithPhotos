const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all(callback){
       db.query(`
       SELECT chefs.*, count(recipes) AS total_recipes
       FROM chefs 
       LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
       GROUP BY chefs.id
       ORDER BY total_recipes DESC
       
       `, function(err, results){
           if(err) throw `${err}`

           callback(results.rows)
       })   
    },
    allrecipes(callback){
        db.query(`SELECT * FROM recipes`, function(err , results){
            if(err) throw `Database ${err}`
            
            callback(results.rows)
        })
    },
    findrecipes(callback){
        db.query(`
        SELECT chefs.*, COUNT (recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        
        `,function(err , results){
            if(err) throw `${err}`
 
            callback(results.rows)
        })
     },
    find(id, callback){
       db.query(`SELECT chefs.* FROM chefs WHERE id = $1
       `, [id],function(err , results){
           if(err) throw `${err}`

           callback(results.rows[0])
       })
    },
    create(data , callback){
        const query = `
        INSERT INTO chefs(
            avatar_url,
            name,
            created_at
        ) VALUES ($1 , $2, $3)
            RETURNING id
        `
        
        const values = [
            data.avatar,
            data.nome_chef,
            date(Date.now()).iso
        ]

        db.query(query , values, function(err , results){
            if(err) throw `${err}`
            
            callback(results.rows[0])
        })
    },
    update(data , callback){
        const query = `
        UPDATE chefs SET 
            avatar_url=($1),
            name=($2),
            created_at=($3)
            Where id = $4
        `
        
        const values = [
            data.avatar,
            data.nome_chef,
            date(Date.now()).iso,
            data.id
        ]

        db.query(query , values, function(err , results){
            if(err) throw `${err}`
            
            callback(results.rows[0])
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM chefs WHERE id = $1`, [id],function(err , results){
            if(err) throw `${err}`
 
            return callback()
        })
    }
}