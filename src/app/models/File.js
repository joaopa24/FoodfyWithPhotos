const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({ filename, path }) {
        const query = `
        INSERT INTO files (
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id 
        `
        const values = [
            filename,
            path
        ]
        return db.query(query,values)
    },
    RecipeFiles({recipe_id, file_id}){
        const query = `
        INSERT INTO recipe_files (
           recipe_id,
           file_id
        ) VALUES ($1, $2)
        RETURNING id
        `
        const values = [
            recipe_id,
            file_id
        ]
        return db.query(query,values)
    },
    async delete(id){
        try{
            console.log(id)
            const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])

            console.log(results.rows[0])
            const file = results.rows[0]

            fs.unlinkSync(file.path)

            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        }catch(err){
            console.error(err)
        }
    }
}