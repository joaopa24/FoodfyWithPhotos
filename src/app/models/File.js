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
            const recipesFiles = await db.query(`SELECT * FROM recipe_files WHERE id = $1`,[id])
            const recipeFile = recipesFiles.rows[0]
            const file = await db.query(`SELECT * FROM files WHERE id = $1`,[recipeFile.file_id])

            fs.unlinkSync(file.rows[0].path)

            await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`,[id])
            
            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        }catch(err){
            console.log(err)
        }
    }
}