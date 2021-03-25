const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all(){
       return db.query(`
       SELECT chefs.*, count(recipes) AS total_recipes
       FROM chefs 
       LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
       GROUP BY chefs.id
       ORDER BY total_recipes DESC
       `)
    },
    allrecipes(){
        return db.query(`SELECT * FROM recipes`)
    },
    findrecipes(){
        return db.query(`
        SELECT chefs.*, COUNT (recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id       
        `)
     },
    find(id){
       return db.query(`SELECT chefs.* FROM chefs WHERE id = $1`, [id])
    },
    create(data){
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

        return db.query(query , values)
    },
    update(data){
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

        return db.query(query , values)
    },
    delete(id){
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    }
}