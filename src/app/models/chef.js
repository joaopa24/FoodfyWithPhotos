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
    create(data,file_id){
        const query = `
        INSERT INTO chefs (
            name,
            file_id,
            created_at
        ) VALUES ($1,$2,$3)
            RETURNING id
        `
        
        const values = [
            data.name,
            file_id,
            date(Date.now()).iso
        ]

        return db.query(query , values)
    },
    update(data,new_id_photo){
        const query = `
        UPDATE chefs SET 
            name=($1),
            file_id=($2),
            created_at=($3)
            WHERE id = $4
        `
        
        const values = [
            data.nome_chef,
            new_id_photo,
            date(Date.now()).iso,
            data.id
        ]

        return db.query(query , values)
    },
    delete(id){
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    },
    async files(id){
        try {
            const results = await db.query(`SELECT *
            FROM files
            LEFT JOIN chefs
            ON (files.id = chefs.file_id)
            WHERE chefs.file_id = $1`, [id])
 
            return results
        } catch(err){
            console.log(err)
        }
    }
}