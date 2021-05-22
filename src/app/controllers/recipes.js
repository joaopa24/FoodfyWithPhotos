const Recipe = require("../models/recipe")
const File = require("../models/file")


module.exports = {
    async home(req, res) {
        let { filter, page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        const params = {
            filter,
            limit,
            offset
        }

        results = await Recipe.paginate(params)
        const recipes = results.rows

        const recipesPromise = recipes.map(async recipe => {
            results = await Recipe.RecipeFiles(recipe.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            recipe.image = files[0]

            return recipe
        })

        const EachRecipe = await Promise.all(recipesPromise)

        return res.render("home", { chefsOptions, recipes:EachRecipe , filter })
    },
    async recipes(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        const params = {
            filter,
            page,
            limit,
            offset
        }

        results = await Recipe.paginate(params)
        const recipes = results.rows

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }
        
        const recipesPromise = recipes.map(async recipe => {
            results = await Recipe.RecipeFiles(recipe.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            recipe.image = files[0]

            return recipe
        })

        const EachRecipe = await Promise.all(recipesPromise)

        return res.render("receitas", { chefsOptions, recipes:EachRecipe, pagination, filter })
    },
    async results(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        const params = {
            filter,
            page,
            limit,
            offset,
        }

        results = await Recipe.paginateResults(params)
        const recipes = results.rows

        const recipesPromise = recipes.map(async recipe => {
            results = await Recipe.RecipeFiles(recipe.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            recipe.image = files[0]

            return recipe
        })

        const EachRecipe = await Promise.all(recipesPromise)

        if (recipes == 0) {
            const pagination = { page }
            return res.render("results", { chefsOptions, recipes, pagination, filter })

        } else {
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
            }
            return res.render("results", { chefsOptions, recipes:EachRecipe, pagination, filter })
        }

    },
    about(req, res) {
        return res.render("sobre")
    },
    async recipe(req, res) {
        const id = req.params.id;

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        results = await Recipe.find(id)
        const recipe = results.rows[0]

        results = await Recipe.RecipeFiles(recipe.id)

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("receita", { chefsOptions, recipe, files })
    },
    async index(req, res) {
        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        results = await Recipe.all()
        let recipes = results.rows

        const recipesPromise = recipes.map(async recipe => {
            results = await Recipe.RecipeFiles(recipe.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            recipe.image = files[0]

            return recipe
        })

        const EachRecipe = await Promise.all(recipesPromise)

        return res.render("Admin/index", { chefsOptions, recipes: EachRecipe })
    },
    async create(req, res) {

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        return res.render("Admin/create", { chefsOptions })
    },
    async recipe_admin(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        results = await Recipe.RecipeFiles(recipe.id)

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("Admin/recipe", { chefsOptions, recipe, files })
    },
    async recipe_admin_edit(req, res) {
        const { id } = req.params

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        results = await Recipe.find(id)
        const recipe = results.rows[0]

        results = await Recipe.RecipeFiles(id)

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        if (!recipe) return res.send("Receita não encontrada")

        return res.render("Admin/edit", { chefsOptions, recipe, files })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Porfavor preencha todos os campos!")
        }

        if (req.files.length == 0) {
            return res.send('Porfavor pelo menos uma imagem!')
        }

        let results = await Recipe.create(req.body)
        const recipe_id = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file }))

        const filesResults = await Promise.all(filesPromise)
        const recipeFiles = filesResults.map(file => {
            const file_id = file.rows[0].id
            File.RecipeFiles({ recipe_id, file_id })
        })

        await Promise.all(recipeFiles)
        return res.redirect(`/admin/Receitas/${recipe_id}`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files" && key != "photos") {
                return res.send("porfavor preencha todos os campos")
            }
        }

        if (req.files.length != 0) {
            const oldFiles = await Recipe.RecipeFiles(req.body.id)

            const totalFiles = oldFiles.rows.length + req.files.length

            if (totalFiles <= 6) {
                const recipe_id = req.body.id
                const newFilesPromise = req.files.map(file => File.create({ ...file }))

                const filesResults = await Promise.all(newFilesPromise)
                const recipeFiles = filesResults.map(file => {
                    const file_id = file.rows[0].id
                    File.RecipeFiles({ recipe_id, file_id })
                })

                await Promise.all(recipeFiles)
            }
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")

            const lastIndex = removedFiles.length - 1

            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(file => File.delete(file))

            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body)

        return res.redirect(`/admin/Receitas/${req.body.id}`)
    },
    delete(req, res) {
        const { id } = req.body

        return res.render("/admin/Receitas")
    }
}